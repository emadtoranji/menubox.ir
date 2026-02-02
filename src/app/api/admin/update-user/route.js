import {
  HandleResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { withRateLimit } from '@utils/rateLimit';
import { hasAccessToAdminAPI } from '../helper/hasAccessToAdminAPI';
import searchUsers from '../helper/searchUsers';
import { applyTransaction } from './applyTransaction';

const limited = withRateLimit({
  max: 100,
  windowMs: 600_000,
});

export const GET = async (req) => {
  return HandleResponse(methodNotAllowedResponse);
};

export const POST = limited(async (req) => {
  try {
    const hasAccess = await hasAccessToAdminAPI();

    if (!hasAccess || !hasAccess.ok || !hasAccess?.result?.id) {
      return HandleResponse(hasAccess);
    }

    const { update = undefined } = await req.json();

    if (!update?.id) {
      return HandleResponse({
        ok: false,
        status: 404,
        message: 'USER_NOT_FOUND',
      });
    }

    try {
      const applyTransaction_result = await applyTransaction({
        update,
        adminId: hasAccess.result.id,
        isDeveloper: hasAccess.result.accessibility === 'developer',
      });
      if (!applyTransaction_result?.ok) {
        return HandleResponse({
          ok: false,
          result: applyTransaction_result?.result || undefined,
          status: applyTransaction_result?.status || 400,
          message: applyTransaction_result?.message || 'Internal Error',
          devMessage: applyTransaction_result?.devMessage || 'AASU4',
        });
      }
    } catch (e) {
      return HandleResponse({
        ...methodFailedOnTryResponse,
        devMessage: 'AASU3: ' + e.message,
      });
    }
    try {
      const searchData = await searchUsers({ id: update.id });

      return HandleResponse({
        ok: true,
        status: 200,
        result: { newResult: searchData.ok ? searchData?.result || [] : [] },
        message: 'MESSAGE',
      });
    } catch (e) {
      return HandleResponse({
        ...methodFailedOnTryResponse,
        devMessage: 'AASU2: ' + e.message,
      });
    }
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'AASU1: ' + e.message,
    });
  }
});
