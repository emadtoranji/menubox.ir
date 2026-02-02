import {
  methodAccessDeniedResponse,
  methodAuthenticationRequiredResponse,
  methodFailedOnTryResponse,
} from '@api/route';
import prisma from '@lib/prisma';
import { auth } from '@utils/auth/NextAuth';

export async function hasAccessToAdminAPI() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return methodAuthenticationRequiredResponse;
    }

    const exists = await prisma.user.findFirst({
      where: {
        id: userId,
        emailVerified: true,
        accessibility: {
          in: ['admin', 'developer'],
        },
        status: 'active',
      },
      select: {
        id: true,
        accessibility: true,
      },
    });

    if (
      typeof exists?.accessibility === 'string' &&
      ['admin', 'developer'].includes(exists.accessibility)
    ) {
      return {
        ok: true,
        result: {
          id: exists.id,
          accessibility: exists.accessibility,
        },
      };
    }

    return methodAccessDeniedResponse;
  } catch (e) {
    return {
      ...methodFailedOnTryResponse,
      devMessage: 'AAHH1: ' + e.message,
    };
  }
}
