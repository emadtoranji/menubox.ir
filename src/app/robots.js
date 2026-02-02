import { BaseUrlAddress } from '@utils/globalSettings';

const disallow = ['/api/', '/admin/', '/cronjob/'];

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallow,
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp'],
        allow: '/',
        disallow: disallow,
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'Google-Extended',
          'Meta-ExternalAgent',
          'Meta-ExternalFetcher',
          'CCBot',
          'Amazonbot',
        ],
        allow: '/',
        disallow: disallow,
      },
    ],
    sitemap: `${BaseUrlAddress}sitemap.xml`,
  };
}
