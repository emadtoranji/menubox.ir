export function getCookie(req, name) {
  const value = req.cookies.get(name)?.value;
  return value || null;
}

export function setCookie(response, name, value, options = {}) {
  const {
    path = '/',
    sameSite = 'strict',
    httpOnly = false,
    secure = process.env.NODE_ENV === 'production',
    maxAge = 60 * 60 * 24 * 365,
  } = options;

  response.cookies.set({
    name,
    value,
    path,
    sameSite,
    httpOnly,
    secure,
    maxAge,
  });

  return response;
}
