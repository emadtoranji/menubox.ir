import {
  HandleResponse,
  methodAuthenticationRequiredResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { auth } from '@utils/auth/NextAuth';
import { withRateLimit } from '@utils/rateLimit';
import { isValidSlug } from '@utils/isValidSlug';
import { isSlugTaken } from '../isSlugTaken';

const limited = withRateLimit({
  max: 3,
  windowMs: 600_000,
});

export const GET = async () => {
  return HandleResponse(methodNotAllowedResponse);
};

export const POST = limited(async (req) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return HandleResponse(methodAuthenticationRequiredResponse);

    const { newSlug } = await req.json();

    if (!newSlug || !isValidSlug(newSlug)) {
      return HandleResponse({
        ok: false,
        message: 'INVALID_SLUG',
        status: 400,
      });
    }

    return HandleResponse(isSlugTaken(newSlug));
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'ADSIST1',
    });
  }
});
