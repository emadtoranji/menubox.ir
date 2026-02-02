import {
  HandleResponse,
  methodAuthenticationRequiredResponse,
  methodNotAllowedResponse,
} from '@api/route';
import prisma from '@lib/prisma';
import { handleSendEmailVerification } from '@server/handleSendEmailVerification';
import { auth } from '@utils/auth/NextAuth';
import { withRateLimit } from '@utils/rateLimit';
import { replaceNonEnglishChar } from '@utils/sanitizer';
import { isValidQualityEmail } from '@utils/validationEmail';

const limited = withRateLimit({
  max: 3,
  windowMs: 600_000,
});

export const GET = async (req) => {
  return HandleResponse(methodNotAllowedResponse);
};

export const POST = limited(async (req) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return HandleResponse(methodAuthenticationRequiredResponse);
  }

  const body = await req.json();
  const { language } = await body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, emailVerified: true },
    });

    if (!user) {
      return HandleResponse({
        ok: false,
        message: 'USER_NOT_FOUND',
        status: 404,
      });
    }

    if (user.emailVerified) {
      return HandleResponse({
        ok: true,
        message: 'EMAIL_ALREADY_VERIFIED',
        status: 200,
      });
    }

    if (!isValidQualityEmail(user.email)) {
      return HandleResponse({
        ok: false,
        message: 'INVALID_EMAIL',
        status: 400,
      });
    }

    const res = await handleSendEmailVerification(
      user.email,
      replaceNonEnglishChar(language),
    );

    if (res?.ok) {
      return HandleResponse({
        ok: true,
        message: res?.message || 'EMAIL_ALREADY_VERIFIED',
        status: 200,
      });
    } else {
      return HandleResponse({
        ok: false,
        message: res?.message || 'INTERNAL_ERROR',
        status: 500,
        devMessage: res?.devMessage || '',
      });
    }
  } catch (e) {
    return HandleResponse({
      ok: false,
      message: 'DATABASE_ERROR',
      status: 500,
      devMessage: e?.message || '',
    });
  }
});
