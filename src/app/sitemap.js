import { languages } from '@i18n/settings';
import { BaseUrlAddress } from '@utils/globalSettings';
import fs from 'fs';
import path from 'path';
import prisma from '@lib/prisma';

const appDir = path.join(process.cwd(), 'src', 'app', '[lng]');

const skipFolders = new Set([
  'api',
  'admin',
  'cronjob',
  'fonts',
  'payment',
  'manifest.json',
  'verify-email',
  'reset-password',
  'signout',
  'not-found',
  'dashboard',
  'test-api',
  '[...rest]',
]);

const excludeFromSitemap = new Set([]);

const pageConfig = {
  home: { priority: 1.0, changeFrequency: 'daily' },
  store: { priority: 0.9, changeFrequency: 'weekly' },
  signin: { priority: 0.8, changeFrequency: 'monthly' },
  signup: { priority: 0.8, changeFrequency: 'monthly' },
  dashboard: { priority: 0.7, changeFrequency: 'monthly' },
  storeBySlug: { priority: 0.9, changeFrequency: 'weekly' },
};

function getPagePriority(pageName) {
  return pageConfig[pageName]?.priority ?? 0.7;
}

function getPageChangeFrequency(pageName) {
  return pageConfig[pageName]?.changeFrequency ?? 'weekly';
}

function extractPageNameFromPath(routePath) {
  if (routePath === '/' || routePath === '') return 'home';
  const parts = routePath.split('/').filter(Boolean);
  const last = parts[parts.length - 1];

  if (routePath.startsWith('/store/') && parts.length === 2) {
    return 'storeBySlug';
  }

  return last || 'home';
}

function getAllStaticRoutes(dir = appDir, baseRoute = '') {
  const routes = ['dashboard'];

  if (!fs.existsSync(dir)) return routes;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const entryName = entry.name;
      const fullPath = path.join(dir, entryName);

      if (
        skipFolders.has(entryName) ||
        (entryName.startsWith('[') && entryName.endsWith(']'))
      ) {
        continue;
      }

      if (entryName.startsWith('(') && entryName.endsWith(')')) {
        routes.push(...getAllStaticRoutes(fullPath, baseRoute));
        continue;
      }

      const pageName = entryName;
      const potentialRoute = baseRoute
        ? `${baseRoute}/${entryName}`
        : entryName;
      const cleanPotential =
        '/' + potentialRoute.replace(/\/+/g, '/').replace(/\/$/, '');

      const hasPageFile = ['page.js', 'page.jsx', 'page.ts', 'page.tsx'].some(
        (ext) => fs.existsSync(path.join(fullPath, ext)),
      );

      if (hasPageFile && !excludeFromSitemap.has(pageName)) {
        const cleanRoute = cleanPotential === '/' ? '/' : cleanPotential;
        routes.push(cleanRoute);
      }

      const nextBase = baseRoute ? `${baseRoute}/${entryName}` : entryName;
      if (!excludeFromSitemap.has(pageName)) {
        routes.push(...getAllStaticRoutes(fullPath, nextBase));
      }
    }
  }

  return routes;
}

async function getDynamicServiceRoutes() {
  try {
    const activeServices = await prisma.store.findMany({
      where: { isActive: true },
      select: { updatedAt: true, slug: true },
    });

    return activeServices.filter((s) => s.slug).map((s) => `/store/${s.slug}`);
  } catch (error) {
    console.error('Failed to fetch store slugs for sitemap:', error);
    return [];
  }
}

function generateHreflangUrls(baseUrl, cleanPath) {
  const hreflang = {};
  for (const lng of languages) {
    const prefixed =
      cleanPath === '/'
        ? `/${lng}`
        : `/${lng}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
    hreflang[lng] = `${baseUrl}${prefixed}`;
  }
  hreflang['x-default'] = `${baseUrl}${
    cleanPath === '/'
      ? ''
      : cleanPath.startsWith('/')
        ? cleanPath
        : '/' + cleanPath
  }`;
  return hreflang;
}

export default async function sitemap() {
  const baseUrl = BaseUrlAddress.endsWith('/')
    ? BaseUrlAddress.slice(0, -1)
    : BaseUrlAddress;

  const staticRoutes = getAllStaticRoutes();
  const dynamicServiceRoutes = await getDynamicServiceRoutes();

  const allRoutes = [
    ...new Set([...staticRoutes, ...dynamicServiceRoutes, '/']),
  ];

  return allRoutes.map((route) => {
    const pageName = extractPageNameFromPath(route);
    const mainUrl =
      route === '/'
        ? baseUrl
        : `${baseUrl}${route.startsWith('/') ? route : '/' + route}`;

    return {
      url: mainUrl,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: getPageChangeFrequency(pageName),
      priority: getPagePriority(pageName),
      alternates: {
        languages: generateHreflangUrls(baseUrl, route),
      },
    };
  });
}
