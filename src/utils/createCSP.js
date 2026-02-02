import { isProduction } from '@utils/globalSettings';

export const createCSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.google.com https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://*.gstatic.com https://*.cloudflareinsights.com https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://*.fontawesome.com https://cdn.jsdelivr.net",
  "img-src 'self' data: https://www.w3.org https://*.google-analytics.com https://*.googletagmanager.com https://stats.g.doubleclick.net",
  "connect-src 'self' https://www.google-analytics.com https://stats.g.doubleclick.net https://*.google.com https://*.cloudflareinsights.com https://cdn.jsdelivr.net",
  "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com https://use.fontawesome.com https://cdn.jsdelivr.net",
  "object-src 'none'",
  "media-src 'self'",
  "base-uri 'self'",
  "frame-src 'self' https://www.google.com https://www.google.com/recaptcha/",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProduction ? ['upgrade-insecure-requests'] : []),
].join('; ');
