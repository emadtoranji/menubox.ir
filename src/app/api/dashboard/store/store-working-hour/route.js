import { validateWorkingHours } from '@utils/dashboard/store/validation/dayOfWeekValidation';
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

export const POST = limited(async (req) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return HandleResponse(methodAuthenticationRequiredResponse);

    const body = await req.json();
    const { storeId, workingHours } = body;

    const errors = validateWorkingHours(workingHours);

    if (errors) {
      return HandleResponse({
        ok: false,
        status: 400,
        message: 'FORM_HAS_ERRORS',
      });
    }

    try {
      await prisma.$transaction([
        prisma.storeWorkingHour.deleteMany({
          where: { storeId },
        }),
        prisma.storeWorkingHour.createMany({
          data: workingHours.map((d) => ({
            storeId,
            dayOfWeek: d.dayOfWeek,
            openTime: d.openTime,
            closeTime: d.closeTime,
            isClosed: d.isClosed,
            is24Hours: d.is24Hours,
          })),
        }),
      ]);
      return HandleResponse({
        ok: true,
        status: 200,
        message: 'SUCCESS',
      });
    } catch (e) {
      return HandleResponse({
        ...methodFailedOnTryResponse,
        devMessage: 'ADSSWH2: ' + ' ' + e.message,
      });
    }
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'ADSSWH1: ' + e.message,
    });
  }
});
