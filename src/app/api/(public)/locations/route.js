import prisma from '@lib/prisma';
import {
  HandleResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { withRateLimit } from '@utils/rateLimit';
import { unstable_cache } from 'next/cache';
import { daysToSecond } from '@utils/numbers';
import { CLEAR_CACHE_VERSION } from '@utils/globalSettings';

const limited = withRateLimit({
  max: 60,
  windowMs: 60_000,
});

const getLocationsCached = unstable_cache(
  async () => {
    try {
      return prisma.location.findMany({
        where: { isActive: true },
        select: {
          countrySlug: true,
          countryEn: true,
          countryLocal: true,
          provinceSlug: true,
          provinceEn: true,
          provinceLocal: true,
        },
      });
    } catch (e) {
      console.log(e?.message);
      return HandleResponse({
        ...methodFailedOnTryResponse,
        devMessage: 'APC2: ' + e?.message,
      });
    }
  },
  ['locations-active-v1_' + CLEAR_CACHE_VERSION],
  {
    revalidate: daysToSecond(1),
  },
);

export const GET = async () => {
  return HandleResponse(methodNotAllowedResponse);
};

export const POST = limited(async () => {
  try {
    const locationsData = await getLocationsCached();

    return HandleResponse({
      ok: true,
      result: locationsData || [],
      status: 200,
    });
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'APC1: ' + e?.message,
    });
  }
});
