import prisma from '@lib/prisma';
import { MAIN_CURRENCY } from '@utils/globalSettings';
import { zibal_verify_bill } from './zibal';
import { nowpayments_verify_bill } from './nowpayments';
import { currencyExchanger } from '@utils/exchanger';
import { replaceNonEnglishChar } from '@utils/sanitizer';

export async function handleVerifyBillFromGateway({
  userId = undefined,
  gateway = undefined,
  authority = undefined,
  trackId = undefined,
  payment_id = undefined,
}) {
  /*   SANITIZE AND VALIDATION   */
  const sanitizedAuthority = replaceNonEnglishChar({
    text: authority ?? trackId ?? payment_id,
  });

  const sanitizedGateway = replaceNonEnglishChar({ text: gateway });

  if (!userId) {
    return {
      ok: false,
      message: 'INVALID_INPUT',
      status: 400,
    };
  }

  if (!sanitizedAuthority || typeof sanitizedAuthority !== 'string') {
    return {
      ok: false,
      message: 'MISSING_PAYMENT_IDENTIFIER',
      status: 400,
    };
  }

  if (typeof sanitizedGateway !== 'string') {
    return {
      ok: false,
      message: 'UNSUPPORTED_GATEWAY',
      status: 400,
    };
  }

  /*   CHECK AUTHORITY EXISTS   */
  let db_result = false;
  try {
    db_result = await prisma.payment.findMany({
      where: {
        authority: sanitizedAuthority,
        userId: userId,
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        authority: true,
        referenceId: true,
        status: true,
        statusCheckedCount: true,
        paidAt: true,
      },
      take: 1,
    });

    if (!db_result || db_result.length === 0) {
      return {
        ok: false,
        message: 'PAYMENT_NOT_FOUND',
        status: 404,
      };
    }
  } catch (e) {
    return {
      ok: false,
      message: 'INTERNAL_ERROR',
      status: 500,
      devMessage: e?.message || undefined,
    };
  }

  const transaction_db = db_result[0];
  let new_result = transaction_db;

  /*   CHECK STATUS WITH GATEWAY   */
  try {
    if (['pending', 'need-more-time'].includes(new_result.status)) {
      if (sanitizedGateway === 'zibal') {
        const gateway_result = await zibal_verify_bill({
          db_amount: Number(transaction_db.amount),
          trackId: sanitizedAuthority,
        });

        new_result = {
          ...transaction_db,
          referenceId:
            gateway_result?.reference_id || transaction_db.referenceId,
          status: gateway_result?.status || transaction_db.status,
          paidAt: gateway_result?.paid_at || transaction_db.paidAt,
        };
      } else {
        return {
          ok: false,
          message: 'UNSUPPORTED_GATEWAY',
          status: 400,
        };
      }
    }
  } catch (e) {
    return {
      ok: false,
      message: 'INTERNAL_ERROR',
      status: 500,
      devMessage: e?.message || undefined,
    };
  }

  /*   CHECK STATUS IS SUCCESS   */
  if (new_result.status === 'success' && transaction_db.status !== 'success') {
    try {
      await prisma.$transaction(async (tx) => {
        const user = await tx.$queryRaw`
          SELECT balance 
          FROM users 
          WHERE id = ${userId}
          FOR UPDATE
        `;

        if (
          !user ||
          user?.[0]?.balance === null ||
          user?.[0]?.balance === undefined
        ) {
          throw new Error('USER_NOT_FOUND_OR_INVALID_BALANCE');
        }

        const oldBalance = Number(user[0].balance);

        if (isNaN(oldBalance) || oldBalance < 0) {
          throw new Error('INVALID_BALANCE');
        }

        const depositAmount = currencyExchanger(
          transaction_db.amount,
          transaction_db.currency,
          MAIN_CURRENCY,
        );

        if (isNaN(depositAmount) || depositAmount <= 0) {
          throw new Error('INVALID_DEPOSIT_AMOUNT');
        }

        await tx.users.update({
          where: { id: userId },
          data: { balance: oldBalance + depositAmount },
        });

        const newBalance = oldBalance + depositAmount;

        await tx.walletTransactions.create({
          data: {
            userId,
            type: 'deposit',
            amount: transaction_db.amount,
            balanceBefore: oldBalance,
            balanceAfter: newBalance,
            referenceId: transaction_db.id,
            referenceType: 'payment',
            performedBy: userId,
          },
        });

        await tx.payments.updateMany({
          where: { authority: transaction_db.authority },
          data: {
            status: 'success',
            referenceId: new_result.referenceId,
            statusCheckedCount:
              (Number(transaction_db.statusCheckedCount) || 0) + 1,
          },
        });
      });
    } catch (e) {
      const knownErrors = [
        'USER_NOT_FOUND_OR_INVALID_BALANCE',
        'INVALID_BALANCE',
        'INVALID_DEPOSIT_AMOUNT',
      ];

      if (knownErrors.includes(e.message)) {
        return {
          ok: false,
          message: e.message,
          status: 400,
        };
      }

      return {
        ok: false,
        message: 'INTERNAL_ERROR',
        status: 500,
        devMessage: e?.message,
      };
    }
  }

  /*   UPDATE NEW STATUS AND RETURN   */
  try {
    if (
      typeof new_result.status === 'string' &&
      new_result.status !== 'success' &&
      new_result.status !== transaction_db.status
    ) {
      await prisma.payments.updateMany({
        where: { authority: transaction_db.authority },
        data: {
          status: new_result.status,
          referenceId: new_result.referenceId,
          statusCheckedCount:
            (Number(transaction_db.statusCheckedCount) || 0) + 1,
        },
      });
    }

    let new_message = '';

    if (new_result.status === 'need-more-time') {
      new_message = 'PAYMENT_VERIFICATION_NEED_MORE_TIME';
    } else if (new_result.status === 'expired') {
      new_message = 'PAYMENT_VERIFICATION_FAILED_BY_GATEWAY';
    } else if (new_result.status === 'refunded-by-gateway') {
      new_message = 'PAYMENT_VERIFICATION_FAILED_BY_GATEWAY';
    } else if (new_result.status === 'partially-paid') {
      new_message = 'PAYMENT_VERIFICATION_PARTIAL';
    } else if (new_result.status === 'canceled') {
      new_message = 'PAYMENT_VERIFICATION_FAILED_BY_GATEWAY';
    } else if (new_result.status === 'failed') {
      new_message = 'PAYMENT_VERIFICATION_FAILED_BY_GATEWAY';
    } else if (new_result.status === 'success') {
      new_message = 'PAYMENT_VERIFIED';
    } else {
      new_message = 'PAYMENT_STATUS_RETRIEVED';
    }

    return {
      ok: true,
      result: new_result,
      message: new_message,
      status: 200,
    };
  } catch (e) {
    return {
      ok: false,
      message: 'INTERNAL_ERROR',
      status: 500,
      devMessage: e?.message || undefined,
    };
  }
}
