'use server';

import { HandleResponse, methodNotAllowedResponse } from '@api/route';
import prisma from '@lib/prisma';
import { users, verificationTokens } from '@database/schema';
import { withRateLimit } from '@utils/rateLimit';
import { replaceNonEnglishChar } from '@utils/sanitizer';
import { reportInternalErrors } from '@server/reportInternalErrors';

const limited = withRateLimit({
  max: 3,
  windowMs: 600_000,
});

export const GET = async () => {
  return HandleResponse(methodNotAllowedResponse);
};

export const POST = limited(async (req) => {
  let { token = null } = await req.json();

  token = replaceNonEnglishChar(token, false, false);
  if (!token) {
    return HandleResponse({
      ok: false,
      message: 'INVALID_INPUT',
      status: 400,
    });
  }

  let verification_db = null;
  try {
    verification_db = await prisma.verificationToken.findFirst({
      where: {
        token: token,
        expires: { gt: new Date() },
      },
      select: { identifier: true, expires: true },
    });

    if (!verification_db) {
      return HandleResponse({
        ok: false,
        message: 'LINK_IS_EXPIRED',
        status: 400,
      });
    }

    if (!verification_db.identifier) {
      return HandleResponse({
        ok: false,
        message: 'INTERNAL_ERROR',
        status: 500,
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

  try {
    const updateResult = await prisma.user.updateMany({
      where: { email: verification_db.identifier },
      data: { emailVerified: true },
    });

    if (updateResult.count === 0) {
      return HandleResponse({
        ok: false,
        message: 'INTERNAL_ERROR',
        status: 400,
      });
    }

    try {
      await prisma.verificationToken.deleteMany({
        where: { identifier: verification_db.identifier },
      });
    } catch (e) {
      reportInternalErrors(e?.message || '');
    }

    return HandleResponse({
      ok: true,
      message: 'EMAIL_VERIFIED_SUCCESSFULLY',
      status: 200,
    });
  } catch (e) {
    return HandleResponse({
      ok: false,
      message: 'DATABASE_ERROR',
      status: 500,
      devMessage: e?.message || '',
    });
  }
});
