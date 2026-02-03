import prisma from '@lib/prisma';
import {
  HandleResponse,
  methodAuthenticationRequiredResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { auth } from '@utils/auth/NextAuth';
import { withRateLimit } from '@utils/rateLimit';
import { hourToSecond } from '@/src/utils/numbers';

const limited = withRateLimit({
  max: 30,
  windowMs: 60_000,
});

const CACHE_TTL = hourToSecond(3);
const cache = {};

export const GET = async () => {
  return HandleResponse(methodNotAllowedResponse);
};

export const POST = limited(async (req) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return HandleResponse(methodAuthenticationRequiredResponse);

    const cacheKey = `store-explorer-log:${userId}`;
    const now = Date.now();
    if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
      return HandleResponse({
        ok: true,
        result: cache[cacheKey].data,
        status: 200,
      });
    }

    const periods = [
      {
        name: 'today',
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      },
      {
        name: 'yesterday',
        where: {
          createdAt: {
            gte: new Date(new Date().getDate() - 1),
            lt: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      },
      {
        name: 'current_month',
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        name: 'previous_month',
        where: {
          createdAt: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 1,
              1,
            ),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        name: 'current_year',
        where: { createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) } },
      },
      {
        name: 'previous_year',
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear() - 1, 0, 1),
            lt: new Date(new Date().getFullYear(), 0, 1),
          },
        },
      },
      { name: 'all', where: {} },
    ];

    let stores = undefined;
    try {
      stores = await prisma.store.findMany({
        where: { userId },
        select: { id: true, name: true, scanLogs: true },
      });
    } catch (e) {
      return HandleResponse({
        ...methodFailedOnTryResponse,
        devMessage: 'ADSSEL2: ' + e.message,
      });
    }

    if (stores === undefined) {
      return HandleResponse({
        ...methodFailedOnTryResponse,
        devMessage: 'ADSSEL3',
      });
    }

    const processed = stores.map((store) => {
      const stats = {};
      periods.forEach((period) => {
        stats[period.name] = store.scanLogs.filter((log) => {
          const logDate = new Date(log.createdAt);
          const where = period.where.createdAt || {};
          if (period.name === 'all') return true;
          if (where.gte && where.lt)
            return logDate >= where.gte && logDate < where.lt;
          if (where.gte) return logDate >= where.gte;
          if (where.lt) return logDate < where.lt;
          return true;
        }).length;
      });
      return { id: store.id, name: store.name, stats };
    });

    cache[cacheKey] = { timestamp: now, data: processed };

    return HandleResponse({
      ok: true,
      result: processed,
      status: 200,
    });
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'ADSSEL1: ' + e.message,
    });
  }
});
