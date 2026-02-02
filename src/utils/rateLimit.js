import { HandleResponse, methodFailedOnTryResponse } from '@api/route';

export function withRateLimit({
  max = 60,
  windowMs = 60_000,
  delayAfter = null,
  delayMs = 1000,
  message = 'TOO_MANY_REQUESTS',
}) {
  max = Math.max(Math.round(max), 1);
  windowMs = Math.max(Math.round(windowMs), 10_000);
  delayMs = Math.max(Math.round(delayMs), 0);

  if (!delayAfter) {
    delayAfter = Math.max(Math.round(max / 2), 1);
  }

  const ipRequestCounts = new Map();

  return (handler) => async (req, context) => {
    const ip =
      req?.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req?.ip ||
      'unknown';

    const now = Date.now();
    let record = ipRequestCounts.get(ip) || {
      count: 0,
      resetTime: now + windowMs,
    };

    if (now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs };
    }

    if (record.count >= delayAfter) {
      const delay = delayMs * (record.count - delayAfter + 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    record.count += 1;
    ipRequestCounts.set(ip, record);

    if (record.count > max) {
      //const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return HandleResponse({
        ok: false,
        status: 429,
        message: 'TOO_MANY_REQUESTS',
      });
    }

    try {
      return handler(req, context);
    } catch (error) {
      console.error(error);
      return HandleResponse({
        ...methodFailedOnTryResponse,
        devMessage: 'RL1:' + error,
      });
    }
  };
}
