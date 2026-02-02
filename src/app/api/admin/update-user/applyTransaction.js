import { isUsernameTaken } from '@server/dashboard/isUsernameTaken';
import prisma from '@lib/prisma';
import { MAX_EMAIL_LENGTH } from '@utils/globalSettings';
import { containsUnsafeString, toBoolean } from '@utils/sanitizer';
import { isValidUsername } from '@utils/validateUsername';
import { normalizeEmail } from '@utils/validationEmail';

export async function applyTransaction({
  update,
  adminId,
  isDeveloper = false,
}) {
  try {
    await prisma.$transaction(async (tx) => {
      if (!update?.id) throw new Error('USER_NOT_FOUND');
      if (!adminId) throw new Error('ACCESS_DENIED');

      if (!isDeveloper && update?.accessibility === 'developer') {
        throw new Error('ACCESS_DENIED');
      }

      const userId = update.id;

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });

      if (!user) throw new Error('USER_NOT_FOUND');

      let newBalance = undefined;
      let oldBalance = Number(user.balance);
      let amountToChange = Number(update?.amountToChange);
      let doBalanceChange = false;

      if (isNaN(amountToChange)) {
        amountToChange = undefined;
      } else {
        if (isNaN(oldBalance) || oldBalance < 0)
          throw new Error('INVALID_BALANCE');

        newBalance = oldBalance + amountToChange;
        if (isNaN(newBalance) || newBalance < 0)
          throw new Error('INVALID_NEW_BALANCE');
        doBalanceChange = true;
      }

      if (update?.username) {
        if (!isValidUsername(update.username))
          throw new Error('INVALID_USERNAME');
        const usernameIsTaken = await isUsernameTaken(update.username, userId);
        if (usernameIsTaken) throw new Error('USERNAME_ALREADY_EXISTS');
      }

      let normalizedEmail = update?.email;

      if (normalizedEmail) {
        normalizedEmail = normalizeEmail(normalizedEmail);
        if (!normalizedEmail) throw new Error('INVALID_EMAIL');
        if (containsUnsafeString(normalizedEmail, MAX_EMAIL_LENGTH))
          throw new Error('INVALID_EMAIL');
      } else {
        throw new Error('INVALID_EMAIL');
      }

      const values = {
        ...(doBalanceChange ? { balance: newBalance } : {}),
        ...(update?.username ? { username: update.username } : {}),
        ...(normalizedEmail ? { email: normalizedEmail } : {}),
        ...(update?.emailVerified !== undefined
          ? { emailVerified: toBoolean(update.emailVerified) }
          : {}),
        ...(update?.accessibility !== undefined
          ? { accessibility: update.accessibility }
          : {}),
        ...(update?.status !== undefined ? { status: update.status } : {}),
      };

      if (Object.keys(values).length === 0) throw new Error('INVALID_INPUT');

      await tx.user.update({
        where: { id: userId },
        data: values,
      });

      if (doBalanceChange) {
        await tx.walletTransaction.create({
          data: {
            userId,
            type: 'admin_adjust',
            amount: amountToChange,
            balanceBefore: oldBalance,
            balanceAfter: newBalance,
            referenceType: 'manual',
            performedBy: adminId,
          },
        });
      }
    });
  } catch (e) {
    return {
      ok: false,
      message: e.message,
      status: 400,
    };
  }

  return {
    ok: true,
    message: 'SUCCESS',
    status: 200,
  };
}
