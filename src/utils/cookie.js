export function getCookie(req, name) {
  const value = req.cookies.get(name)?.value;
  return value || null;
}

export const cookieDefaultOptions = {
  path: '/',
  sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 365,
  expires: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000),
};

export function setCookie(response, options = {}) {
  const { name, value, path, sameSite, httpOnly, secure, maxAge, expires } = {
    ...cookieDefaultOptions,
    ...options,
  };
  response.cookies.set(name, value, {
    path,
    sameSite,
    httpOnly,
    secure,
    maxAge,
    expires,
  });

  return response;
}

export const getCookieDocument = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const setCookieDocument = (name, value, maxAgeSeconds) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
};
