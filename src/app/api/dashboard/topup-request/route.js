import {
  HandleResponse,
  methodAuthenticationRequiredResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { auth } from '@utils/auth/NextAuth';
import { withRateLimit } from '@utils/rateLimit';
import { handleCreateBillFromGateway } from '@server/payment/handleCreateBillFromGateway';

const limited = withRateLimit({
  max: 5,
  windowMs: 600_000,
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

  const { gateway = undefined, amount = 0, currency = undefined } = body;

  const result = await handleCreateBillFromGateway({
    userId,
    gateway,
    amount,
    currency,
  });
  if (result.ok && typeof result?.response?.payment_url === 'string') {
    return HandleResponse({
      ok: true,
      result: {
        payment_url: result?.response?.payment_url,
      },
      message: 'REQUEST_FOR_INVOICE_SUCCESSFUL',
      status: 200,
    });
  }
  return HandleResponse({
    ok: result?.ok || false,
    result: result?.result || {},
    message: result?.message || 'INVOICE_CREATION_FAILED',
    status: result?.status || 500,
    devMessage: result?.devMessage || undefined,
  });
});
