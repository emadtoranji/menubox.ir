import {
  HandleResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { withRateLimit } from '@utils/rateLimit';
import { hasAccessToAdminAPI } from '../helper/hasAccessToAdminAPI';
import searchUsers from '../helper/searchUsers';

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

    const { query = undefined } = await req.json();

    try {
      const userData = await searchUsers({ query });
      if (!userData.ok) {
        return HandleResponse(userData);
      }

      return HandleResponse({
        ok: true,
        result: userData?.result || [],
        status: 200,
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
