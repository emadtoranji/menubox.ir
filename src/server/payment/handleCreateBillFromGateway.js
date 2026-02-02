import prisma from '@lib/prisma';
import {
  allGateways,
  iranianGatewayAmountRange,
  MAIN_CURRENCY,
} from '@utils/globalSettings';
import { zibal_create_bill } from './zibal';
import { nowpayments_create_bill } from './nowpayments';

async function create_payment_row({
  userId,
  gateway_name,
  amount,
  sanitizedCurrency,
}) {
  try {
    const db_insert = await prisma.payment.create({
      data: {
        userId,
        gatewayName: gateway_name,
        amount,
        sanitizedCurrency,
        status: 'pending',
      },
      select: {
        id: true,
      },
    });

    if (db_insert?.id) {
      return {
        ok: true,
        id: db_insert.id,
      };
    } else {
      return {
        ok: false,
        message: 'DATABASE_ERROR',
        status: 500,
      };
    }
  } catch (e) {
    return {
      ok: false,
      message: 'DATABASE_ERROR',
      status: 500,
      devMessage: e?.message || null,
    };
  }
}

export async function handleCreateBillFromGateway({
  userId = undefined,
  gateway = undefined,
  amount = 0,
  currency = MAIN_CURRENCY,
}) {
  /*   SANITIZE AND VALIDATION   */
  const sanitizedCurrency = replaceNonEnglishChar(currency);
  const sanitizedGateway = replaceNonEnglishChar(gateway);

  if (!userId) {
    return {
      ok: false,
      message: 'INVALID_INPUT',
      status: 400,
    };
  }

  amount = Number(amount);

  if (isNaN(amount)) {
    return {
      ok: false,
      message: 'INVALID_INPUT',
      status: 400,
    };
  }

  if (
    !isNaN(iranianGatewayAmountRange.min) &&
    amount < iranianGatewayAmountRange.min
  ) {
    return {
      ok: false,
      message: 'AMOUNT_BELOW_MINIMUM',
      status: 400,
    };
  }

  if (
    !isNaN(iranianGatewayAmountRange.max) &&
    amount > iranianGatewayAmountRange.max
  ) {
    return {
      ok: false,
      message: 'AMOUNT_EXCEEDS_MAXIMUM',
      status: 400,
    };
  }

  const isGatewayExists = allGateways.some(
    (f) => f.id === sanitizedGateway && f.liveCheck && f.active,
  );

  if (typeof sanitizedGateway !== 'string' || !isGatewayExists) {
    return {
      ok: false,
      message: 'UNSUPPORTED_GATEWAY',
      status: 400,
    };
  }

  if (
    typeof sanitizedCurrency !== 'string' ||
    sanitizedCurrency !== MAIN_CURRENCY
  ) {
    return {
      ok: false,
      message: 'INVALID_CURRENCY',
      status: 400,
    };
  }

  /*   START CREATE PAYMENT URL FROM GATEWAY   */
  let result = [];
  let gateway_name = '';

  const create_payment_row_result = await create_payment_row({
    userId,
    gateway_name,
    amount,
    sanitizedCurrency,
  });

  const payment_id = create_payment_row_result?.id;

  if (!create_payment_row_result.ok || !payment_id) {
    return {
      ok: false,
      message: create_payment_row_result?.message || 'DATABASE_ERROR',
      status: create_payment_row_result?.status || 500,
      devMessage: create_payment_row_result?.devMessage || '',
    };
  }

  const inputForBillCreator = {
    amount,
    sanitizedCurrency,
    order_id: payment_id,
    description: 'topup-website-wallet',
  };

  if (sanitizedGateway === 'IRANIAN') {
    result = await zibal_create_bill(inputForBillCreator);
    gateway_name = 'zibal';
  } else if (sanitizedGateway === 'CRYPTOCURRENCY') {
    result = await nowpayments_create_bill(inputForBillCreator);
    gateway_name = 'nowpayments';
  } else {
    await prisma.payments.delete({
      where: {
        id: payment_id,
      },
    });
  }

  if (result?.ok && result?.result?.authority && result?.result?.payment_url) {
    const update_result = await prisma.payments.updateMany({
      where: {
        id: payment_id,
      },
      data: {
        authority: result.result.authority,
      },
    });

    if (update_result.count <= 0) {
      return HandleResponse({
        ...methodFailedOnTryResponse,
        message: 'PAYMENT_GATEWAY_CREATE_ERROR',
        devMessage: 'ADUU1',
      });
    }

    return {
      ok: true,
      message: 'REQUEST_FOR_INVOICE_SUCCESSFUL',
      result: { payment_url: result.result.payment_url },
      status: 200,
    };
  } else {
    await prisma.payments.updateMany({
      where: {
        id: payment_id,
      },
      data: {
        status: 'failed',
      },
    });

    return {
      ok: false,
      message: result?.message || 'PAYMENT_GATEWAY_CREATE_ERROR',
      status: 500,
    };
  }
}
