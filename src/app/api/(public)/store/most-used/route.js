import { unstable_cache } from 'next/cache';
import { HandleResponse, methodNotAllowedResponse } from '@api/route';
import { withRateLimit } from '@utils/rateLimit';
import { fallbackLng } from '@i18n/settings';
import { reportInternalErrors } from '@server/reportInternalErrors';
import prisma from '@lib/prisma';
import { CLEAR_CACHE_VERSION } from '@utils/globalSettings';

const limited = withRateLimit({
  max: 120,
  windowMs: 60_000,
});

const CACHE_TIME = process.env.NODE_ENV === 'production' ? 86400 : 1;

const fetchStores = async () => {
  const rows = await prisma.store.findMany({
    where: {
      isActive: 1,
    },
    orderBy: {
      updateTime: 'desc',
    },
    take: 5,
    select: {
      name: true,
      slug: true,
      location: {
        select: {
          countryLocal: true,
          provinceLocal: true,
        },
      },
      logoUrl: true,
    },
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return rows;
};

const getStoresCacheOK = ({ language }) =>
  unstable_cache(
    async () => {
      let rows = [];

      try {
        rows = await fetchStores();
      } catch (e) {
        reportInternalErrors({
          type: 'danger',
          section: 'api/public/store/most-used',
          message: 'Fetching Most Used Services Failed: ' + e.message,
        });
      }

      return {
        ok: true,
        status: 200,
        result: rows,
        message: 'SUCCESS',
      };
    },
    ['store/most-used-v1-cache' + CLEAR_CACHE_VERSION, `language:${language}`],
    { revalidate: CACHE_TIME },
  );

const getStoresCached = async ({ language }) => {
  try {
    const rows = await fetchStores();

    if (!rows) {
      throw new Error('EMPTY_RESULT');
    }

    return {
      ok: true,
      status: 200,
      result: rows,
      message: 'SUCCESS',
    };
  } catch (e) {
    try {
      const fallback = await getStoresCacheOK({ language })();

      if (fallback?.ok) {
        return {
          ...fallback,
          message: 'CACHE_FALLBACK',
        };
      }
    } catch {}

    return {
      ok: false,
      status: 500,
      message: 'FAILED_AND_NO_CACHE',
      devMessage: 'ASMU1 ' + e,
    };
  }
};

export const POST = limited(async (req) => {
  const body = await req.json().catch(() => ({}));
  const language = body?.language || fallbackLng;

  const data = await getStoresCached({ language });
  return HandleResponse(data);
});

export const GET = async () => {
  return HandleResponse(methodNotAllowedResponse);
};
