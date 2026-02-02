import i18next from '@i18n/i18next';
import { fallbackLng, languages } from '@i18n/settings';

export async function getT(lng, ns, options) {
  if (!languages.includes(lng)) {
    lng = fallbackLng;
  }

  if (i18next.language !== lng) {
    await i18next.changeLanguage(lng);
  }

  const namespaces = Array.isArray(ns)
    ? ns
    : ns
    ? [ns]
    : [i18next.options.defaultNS];

  for (const n of namespaces) {
    if (!i18next.hasLoadedNamespace(n)) {
      await i18next.loadNamespaces(n);
    }
  }

  return {
    t: i18next.getFixedT(lng, namespaces[0], options?.keyPrefix),
    i18n: i18next,
    lng: i18next.language,
  };
}
