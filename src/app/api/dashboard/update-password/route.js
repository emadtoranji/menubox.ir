import prisma from '@lib/prisma';
import {
  HandleResponse,
  methodAuthenticationRequiredResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { auth, signOut } from '@utils/auth/NextAuth';
import { withRateLimit } from '@utils/rateLimit';
import { validateStrongPassword } from '@utils/validateStrongPassword';
import bcrypt from 'bcryptjs';

const limited = withRateLimit({
  max: 3,
  windowMs: 600_000,
});

export const GET = async () => {
  return HandleResponse(methodNotAllowedResponse);
};

export const POST = limited(async (req) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return HandleResponse(methodAuthenticationRequiredResponse);
  }

  const body = await req.json();
  const { old_password, new_password, new_password_verify } = await body;

  if (!new_password || !new_password_verify) {
    return HandleResponse({
      ok: false,
      message: 'NEW_PASSWORD_IS_MISSING',
      code: 400,
    });
  }

  const isStrong = validateStrongPassword(new_password);
  if (!isStrong.ok) {
    return HandleResponse({
      ok: false,
      message: isStrong?.reason || 'PASSWORD_NOT_STRONG',
    });
  }

  if (new_password !== new_password_verify) {
    return HandleResponse({
      ok: false,
      message: 'PASSWORDS_DO_NOT_MATCH',
      code: 400,
    });
  }

  try {
    let old_password_database;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true },
      });
      old_password_database = user?.passwordHash;
    } catch (e) {
      return HandleResponse({
        ...methodFailedOnTryResponse,
        devMessage: 'ADUP4',
      });
    }

    let is_old_password_correct = false;
    if (old_password_database === null) {
      is_old_password_correct = true;
    } else {
      if (!old_password) {
        return HandleResponse({
          ok: false,
          message: 'OLD_PASSWORD_IS_MISSING',
          code: 400,
        });
      }
      try {
        is_old_password_correct = bcrypt.compareSync(
          old_password,
          old_password_database,
        );
      } catch (e) {
        return HandleResponse({
          ...methodFailedOnTryResponse,
          devMessage: 'ADUP5',
        });
      }
    }

    if (is_old_password_correct) {
      try {
        let passwordHash = null;
        try {
          passwordHash = await bcrypt.hash(new_password, 12);
        } catch (e) {
          return HandleResponse({
            ...methodFailedOnTryResponse,
            devMessage: 'ADUP1',
          });
        }

        try {
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
          });

          if (updatedUser?.id) {
            await signOut({ redirect: false });
            return HandleResponse({
              ok: true,
              message: 'PASSWORD_CHANGED',
              status: 200,
            });
          } else {
            return HandleResponse({
              ...methodFailedOnTryResponse,
              devMessage: 'ADUP2',
            });
          }
        } catch (e) {
          return HandleResponse({
            ...methodFailedOnTryResponse,
            devMessage: 'ADUP6',
          });
        }
      } catch (e) {
        return HandleResponse({
          ...methodFailedOnTryResponse,
          devMessage: 'ADUP6',
        });
      }
    } else {
      return HandleResponse({
        ok: true,
        message: 'OLD_PASSWORD_IS_INCORRECT',
        status: 200,
      });
    }
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'ADUP3' + e,
    });
  }
});
