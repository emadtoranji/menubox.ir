import { HandleResponse } from '@api/route';

export function withRateLimitDynamic({
  getMax = () => 60,
  getWindowMs = () => 60_000,
  delayAfter = null,
  delayMs = 1000,
  message = 'TOO_MANY_REQUESTS',
}) {
  const ipRequestCounts = new Map();

  return (handler) => async (req, context) => {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.ip ||
      'unknown';
    const now = Date.now();

    const max = getMax(req);
    const windowMs = getWindowMs(req);
    if (!delayAfter) delayAfter = Math.max(Math.round(max / 2), 1);

    let record = ipRequestCounts.get(ip) || {
      count: 0,
      resetTime: now + windowMs,
    };
    if (now > record.resetTime)
      record = { count: 0, resetTime: now + windowMs };

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

    return handler(req, context);
  };
}
