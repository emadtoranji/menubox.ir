import { HandleResponse, methodNotAllowedResponse } from '@api/route';
import prisma from '@lib/prisma';
import { reportInternalErrors } from '@server/reportInternalErrors';
import { withRateLimit } from '@utils/rateLimit';

const limited = withRateLimit({
  max: 1,
  windowMs: 60_000,
});

export const GET = limited(async (req) => {
  const { searchParams } = new URL(req.url);

  if (searchParams.get('token') !== CRONJOB_TOKEN) {
    return HandleResponse(methodAccessDeniedResponse);
  }

  try {
    await prisma.verificationToken.deleteMany({
      where: { expires: { lt: new Date() } },
    });
  } catch (e) {
    reportInternalErrors({
      type: 'danger',
      section: 'cronjob/database-cleaner',
      message: 'Database Cleaning error: ' + e.message,
    });
    return HandleResponse({
      ok: false,
      status: 500,
      message: 'INTERNAL_ERROR',
      devMessage: e.message,
    });
  }

  reportInternalErrors({
    type: 'info',
    section: 'cronjob/database-cleaner',
    message: 'Database Cleaning Done.',
  });

  return HandleResponse({
    ok: true,
    status: 200,
    message: 'SUCCESS',
  });
});

export const POST = async () => {
  return HandleResponse(methodNotAllowedResponse);
};
