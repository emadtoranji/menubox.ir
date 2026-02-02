import prisma from '@lib/prisma';
import {
  HandleResponse,
  methodAuthenticationRequiredResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { auth } from '@utils/auth/NextAuth';
import { withRateLimit } from '@utils/rateLimit';

const limited = withRateLimit({
  max: 10,
  windowMs: 60_000,
});

export const GET = async () => {
  return HandleResponse(methodNotAllowedResponse);
};

export const POST = async () => {
  return HandleResponse(methodNotAllowedResponse);
};

export const DELETE = limited(async (req) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return HandleResponse(methodAuthenticationRequiredResponse);

    let { id } = await req.json();

    try {
      await prisma.store.delete({
        where: {
          id,
          userId,
        },
      });

      return HandleResponse({
        ok: true,
        status: 200,
        message: 'DELETED',
      });
    } catch (e) {
      return HandleResponse({
        ...methodFailedOnTryResponse,
        devMessage: 'ADSSD2: ' + ' ' + e.message,
      });
    }
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'ADSSD1: ' + e.message,
    });
  }
});
