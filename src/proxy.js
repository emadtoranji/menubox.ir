import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import crypto from 'crypto';
import { fallbackLng, languages, cookieName } from '@i18n/settings';
import { hasValidIncomingDataForAPIRoute } from '@utils/sanitizer';
import { createCSP } from '@utils/createCSP';
import { HandleResponse, methodAccessDeniedResponse } from '@api/route';
import { getCookie, setCookie } from '@utils/cookie';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    // All routes enter middleware EXCEPT these listed paths and files
    // These paths are loaded directly and do NOT go through proxy
    '/((?!_next/static|_next/image|assets|styles|images|manifest.json|.well-known|sitemap.xml|robots.txt|favicon.ico).*)',
  ],
};

export async function proxy(req) {
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = String(segments?.[0] || '').toLowerCase();

  if (pathname.includes('icon') || pathname.includes('chrome')) {
    return NextResponse.next();
  }

  if (firstSegment === 'api') {
    const ok = await hasValidIncomingDataForAPIRoute(req);
    if (!ok) {
      return HandleResponse(methodAccessDeniedResponse);
    }
    return NextResponse.next();
  }

  const response = NextResponse.next();

  let currentLang = fallbackLng;
  if (firstSegment && languages.includes(firstSegment)) {
    currentLang = firstSegment;
  } else {
    const langCookie = getCookie(req, cookieName) || undefined;
    if (langCookie && languages.includes(langCookie)) {
      currentLang = langCookie;
    }
  }
  setCookie(response, cookieName, currentLang);

  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL(`/${currentLang}`, req.url), 301);
  } else if (currentLang !== firstSegment) {
    const url = new URL(req.url);
    url.pathname = `/${currentLang}${url.pathname}`;
    return NextResponse.redirect(url);
  }

  response.headers.set('Content-Security-Policy', createCSP);
  response.headers.set('x-nonce', crypto.randomBytes(16).toString('base64'));

  return response;
}
