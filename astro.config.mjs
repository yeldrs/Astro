// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: 'https://yassineelidrissi.com',
  // Tolerate both /about and /about/ (GitHub Pages serves the extensionless form).
  trailingSlash: 'ignore',

  // 'file' → emits /about.html rather than /about/index.html. Note: this means
  // no dist/fr/index.html exists, so locale-root links must be "/fr" not "/fr/"
  // and fragment links "/fr#projects" not "/fr/#projects" (see src/i18n/utils.ts).
  build: {
    format: 'file'
  },
  output: 'static',

  // i18n: English is the default locale and stays unprefixed at the root
  // (matches existing canonical URLs); French lives under /fr/.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          fr: 'fr-FR',
        },
      },
    }),
  ],
  redirects: {
    '/work': '/#projects',
    '/projects': '/#projects',
    '/aboutme': '/about',
    '/logos': '/',
    '/photography': '/',
    '/fr/work': '/fr#projects',
    '/fr/projects': '/fr#projects',
    '/fr/aboutme': '/fr/about',
    '/fr/logos': '/fr',
    '/fr/photography': '/fr',
  }
});
