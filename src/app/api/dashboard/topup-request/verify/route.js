import {
  HandleResponse,
  methodAuthenticationRequiredResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { auth } from '@utils/auth/NextAuth';
import { withRateLimit } from '@utils/rateLimit';
import { handleVerifyBillFromGateway } from '@server/payment/handleVerifyBillFromGateway';

const limited = withRateLimit({
  getMax: 5,
  windowMs: 60_000,
});

export const GET = async () => {
  return HandleResponse(methodNotAllowedResponse);
};

export const POST = limited(async (req) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return HandleResponse(methodAuthenticationRequiredResponse);
  }
  const body = await req.json();

  const {
    gateway = undefined,
    authority = undefined,
    trackId = undefined,
    payment_id = undefined,
  } = body;

  const result = await handleVerifyBillFromGateway({
    userId,
    gateway,
    authority,
    trackId,
    payment_id,
  });
  if (result.ok && typeof result?.response?.payment_url === 'string') {
    return HandleResponse({
      ok: true,
      result: {
        payment_url: result?.response?.payment_url,
      },
      message: 'PAYMENT_VERIFIED',
      status: 200,
    });
  }
  return HandleResponse({
    ok: result?.ok || false,
    result: result?.result || {},
    message: result?.message || 'PAYMENT_GATEWAY_VERIFY_ERROR',
    status: result?.status || 500,
    devMessage: result?.devMessage || undefined,
  });
});
