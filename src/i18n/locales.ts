// src/i18n/locales.ts
// One place for per-locale metadata. Consumed by BaseLayout (hreflang, og:locale,
// JSON-LD inLanguage), ProjectLayout (inLanguage) and Navbar (switcher label).

export const LOCALES = {
  en: { bcp47: "en-US", ogLocale: "en_US", label: "EN" },
  fr: { bcp47: "fr-FR", ogLocale: "fr_FR", label: "FR" },
} as const;

export type Locale = keyof typeof LOCALES;
