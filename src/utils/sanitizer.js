export function containsUnsafeString(str, maxLength = 5000) {
  if (typeof str !== 'string') return true;
  if (str.length === 0 || str.length > maxLength) return true;
  if (/[<>]/.test(str)) return true;
  if (/[\x00-\x08\x0E-\x1F\x7F]/.test(str)) return true;
  if (/__proto__|constructor|prototype/.test(str)) return true;
  return false;
}

function isObjectSafe(obj, maxLength = 2000) {
  if (typeof obj !== 'object' || obj === null) return true;
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'string' && containsUnsafeString(value, maxLength)) {
      return false;
    }
    if (typeof value === 'object' && !isObjectSafe(value, maxLength)) {
      return false;
    }
  }
  return true;
}

export function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return (
      lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on'
    );
  }
  if (typeof value === 'number') return value === 1;
  return false;
}

export async function isValidBody(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      message: 'INVALID_JSON',
      status: 400,
    };
  }

  if (!body || typeof body !== 'object') {
    return {
      ok: false,
      message: 'INVALID_REQUEST_BODY',
      status: 400,
    };
  }

  if (Object.keys(body).length === 0) {
    return {
      ok: false,
      message: 'EMPTY_REQUEST_BODY',
      status: 400,
    };
  }

  return {
    ok: true,
    body,
    status: 200,
  };
}

export async function hasValidIncomingDataForAPIRoute(req) {
  const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE'];

  const url = new URL(req.url);
  for (const [, value] of url.searchParams.entries()) {
    if (containsUnsafeString(value)) {
      return false;
    }
  }

  for (const [, value] of req.headers.entries()) {
    if (containsUnsafeString(value)) {
      return false;
    }
  }

  // if (methodsWithBody.includes(req.method)) {
  //   try {
  //     const clone = req.clone();
  //     const body = await clone.json();
  //     if (!isObjectSafe(body)) {
  //       return false;
  //     }
  //   } catch {
  //     return false;
  //   }
  // }

  return true;
}

export function replaceNonEnglishChar({
  text = '',
  underscore = true,
  dash = true,
  dot = true,
  colon = false,
}) {
  if (typeof text !== 'string') return '';

  let allowed = 'a-zA-Z0-9';
  if (underscore) allowed += '_';
  if (dot) allowed += '\\.';
  if (dash) allowed += '\\-';
  if (colon) allowed += ':';

  const regex = new RegExp(`[^${allowed}]`, 'g');
  return text.replace(regex, '').trim();
}
