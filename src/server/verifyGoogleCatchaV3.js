export async function verifyGoogleCatchaV3(token) {
  const GOOGLE_RECAPTCHA_SECRET_KEY =
    typeof process.env.GOOGLE_RECAPTCHA_SECRET_KEY === 'string'
      ? process.env.GOOGLE_RECAPTCHA_SECRET_KEY
      : '';

  if (!GOOGLE_RECAPTCHA_SECRET_KEY) {
    return false;
  }

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${GOOGLE_RECAPTCHA_SECRET_KEY}&response=${token}`,
  });
  const data = await res.json();
  return !!(data.success && (!data.score || data.score >= 0.5));
}
