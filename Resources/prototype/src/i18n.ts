import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * i18n bootstrap for the vendored CRD layer.
 *
 * Every CRD component resolves its labels through `useTranslation('crd-<feature>')`,
 * so the prototype has to register those namespaces or the UI renders raw keys.
 *
 * client-web's own preview app (`src/crd/app/main.tsx`) hand-lists 14 English
 * namespaces because that is all its demo pages touch. The prototype renders far
 * more of the layer than that, so this discovers every bundle in `src/crd/i18n/`
 * instead — all 27 namespaces across all 6 languages. New translation files that
 * arrive on the next CRD sync are picked up with no change here.
 *
 * File layout is `i18n/<feature>/<feature>.<lang>.json`, e.g.
 * `i18n/contributorSettings/contributorSettings.en.json` → namespace
 * `crd-contributorSettings`, language `en`.
 */
const bundles = import.meta.glob<Record<string, unknown>>('./crd/i18n/**/*.json', {
  eager: true,
  import: 'default',
});

const BUNDLE_PATH = /\/i18n\/([^/]+)\/\1\.([a-z]{2})\.json$/;

const resources: Record<string, Record<string, Record<string, unknown>>> = {};
const namespaces = new Set<string>();

for (const [path, bundle] of Object.entries(bundles)) {
  const match = BUNDLE_PATH.exec(path);
  if (!match) continue;

  const [, feature, language] = match;
  const namespace = `crd-${feature}`;

  resources[language] ??= {};
  resources[language][namespace] = bundle;
  namespaces.add(namespace);
}

export const SUPPORTED_LANGUAGES = Object.keys(resources).sort();
export const CRD_NAMESPACES = [...namespaces].sort();

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  ns: CRD_NAMESPACES,
  // Matches client-web: components that omit the namespace fall back to layout.
  defaultNS: 'crd-layout',
  interpolation: {
    // React already escapes interpolated values.
    escapeValue: false,
  },
});

export default i18n;
