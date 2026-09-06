# CHANGELOG

> **Reference only. Do not read this file in full.** Open a single dated entry when you need
> to know *why* a specific past change was made. What's *next* lives in `BACKLOG.md`.

Format: `## YYYY-MM-DD — title` + short bullets (`file/area — action — reason`).
Older entries are archived under `docs/archive/` once a month is closed.

---

## 2026-09-06 — Restructuration: scalabilité manuelle + IA, économie de tokens

Branch `refactor/structure-2026`. Audit → 6 phases. See the plan for the full rationale.

### Phase 0 — prod bug fixes + dead-code cleanup
- `robots.txt` → moved into `public/` (was at repo root → never served: the `Sitemap`
  directive and AI-crawler allowlist had no effect in production).
- `BaseLayout.astro` — removed `<link>` to `android-chrome-16x16/32x32.png` (files absent →
  404 per page); consolidated the favicon/manifest/theme-color block.
- `BaseLayout.astro` — default `og:image` → new `public/images/og-default.jpg` (1200×630 JPEG;
  WebP OG images don't preview on X/LinkedIn) + `og:image:alt` / `twitter:image:alt`.
- `astro.config.mjs` — `/fr/work` and `/fr/projects` redirect target `/fr/#projects` →
  `/fr#projects` (slash-before-fragment 404s on GitHub Pages under `build.format:'file'`).
- `HomeLayout` / `AboutLayout` / `ProjectLayout` — inner `<main>` → `<div>` (only `BaseLayout`
  keeps `<main>`; nested landmark was invalid HTML on every page).
- `manifest.json` — `theme_color` `#367984` → `#4364e8` (match `<meta name="theme-color">`).
- Removed: `@astrojs/mdx` integration + dependency (no `.mdx` files, no Markdown bodies),
  `Divider.astro` (0 imports), `.btn` / `.btn-outline` in `global.css` (0 uses), duplicate
  root `CNAME`, debug comments in `deploy.yml` / `astro.config.mjs`.
- Verified: `npm run build` green; rendered page text byte-identical to pre-change baseline.

### Phase 1 — documentation split
- 4 overlapping docs (~23k tokens) → `CLAUDE.md` (rewritten, ~1.6k tokens) + `BACKLOG.md`
  (new, open items) + `CHANGELOG.md` (new, this file) + `ARCHITECTURE.md` (new, on-demand).
  `README.md` trimmed. `whitepaper.txt` + `MAINTENANCE_LOG.md` deleted (history condensed here,
  pre-August archived to `docs/archive/`).

### Phase 2 — content model: one file per case study
- `src/content/projects/{en,fr}/<name>.md` (2 files, frontmatter-only, positional image array)
  → `src/content/projects/<name>.yaml` (1 file, `type: "data"`). Shared fields
  (`semanticSlug`, `publishDate`, `isDraft`, `cover`, `images`, `credits`) at the top level;
  translated copy under `en:` / `fr:` blocks.
- Images: positional `projectImages` array → named `images.{context,role,conception,results}`
  `{ main, secondary }` + `images.carousel[]`. `src/content/resolveImages.ts` deleted (images
  are shared now, no cross-file inheritance).
- `src/content/config.ts` — schema rewritten; `publishDate` now regex-validated `YYYY-MM-DD`.
- `src/pages/work/[slug].astro` + `fr/…` — `getStaticPaths` filters by `isDraft` (+ `data.fr`
  for FR) and passes `lang`; both read the same entry.
- `ProjectLayout.astro` — reads `copy` (the locale block), `data.images`, `data.credits`;
  flattens `images` back to the positional array the section markup expects; `project.render()`
  / `<Content />` removed (no Markdown bodies).
- `HomeLayout.astro` — filters/maps the collection to the locale block; `ProjectCard` gets a
  stable `umamiSlug` (the `semanticSlug`) instead of a label derived from `client`.
- Removed `@astrojs/mdx` (done in Phase 0). Added `@astrojs/check` + `typescript` + `npm run
  check` / `predeploy` scripts.
- Migration by `scripts/migrate-projects.mjs` (verbatim string copy). Source `.md` preserved
  under `docs/_migration-source/` for review — **both are deleted before merge**.
- Verified: `npm run build` green, `astro check` 0 errors, rendered page text on all 10 routes
  byte-identical to baseline; image placement / carousel / credits / JSON-LD spot-checked.
- Pre-existing content divergences carried over verbatim, logged in `BACKLOG.md`.

### Phase 3 — ProjectLayout section/figure extraction
- `ProjectLayout.astro` 787 → 558 lines. New `ProjectSection.astro` (heading +
  paragraph/bulleted-list, hidden when empty) replaces the ~7×-repeated section block; new
  `ProjectFigure.astro` (clickable modal image) replaces the ~8×-repeated image block **and**
  adds keyboard access (`role="button"`, `tabindex="0"`, Enter/Space) the bare `<div onclick>`
  lacked. `designConception` stays inline (own shape). No visual change (text byte-identical).

### Phase 4 — dedup + token-chain gaps
- `src/i18n/locales.ts` (new): `LOCALES` = per-locale `{ bcp47, ogLocale, label }`. Replaces
  the locale→BCP-47 map that was duplicated across `BaseLayout` (hreflang, `og:locale`,
  JSON-LD), `ProjectLayout` and `Navbar`. Dead `languages` export removed from `ui.ts`.
- `ArrowButton.astro` — dropped 5 required-but-ignored colour props; removed the matching
  `DS_CLASSES` consts + spreads from `ProjectCarousel` / `ProjectLayout`. Output unchanged.
- `tailwind.config.mjs` — `colors.gray` and `fontSize.xs` wired from `tokens.js`. Only
  `gray-50/200/600` are used; 50/200 identical, `gray-600` hover shifts `#4b5563`→`#4a5565`
  (matches the semantic text tokens). `text-xs` unchanged.

### Phase 5 — skills + CI
- `.claude/skills/`: `add-case-study`, `translate-content`, `predeploy-check`.
- `.github/workflows/deploy.yml` — added a non-blocking `check` job (`astro check`),
  `concurrency: { group: pages }`, Node 22 (was 20). `.nvmrc` added.
- `package.json` — `check` + `predeploy` scripts (added in Phase 2).

### Fix — fullscreen image modal (pre-existing bug, found during review)
- The modal was fed the flattened positional image array (with empty `""` slots), so
  prev/next arrows showed on standalone section images and "navigating" hit a blank
  `src`; the CDC carousel couldn't be paged backward. The modal now pages through
  `data.images.carousel` only — a standard section image opens on its own (no arrows,
  keyboard nav is a no-op). Both arrows render visible; disabled-at-the-ends is the
  `disabled` attribute + `disabled:opacity-30`. Verified in-browser.

## 2026-08-24 — About CTA: copy email + mailto

- `src/layouts/AboutLayout.astro` — the top "Let's connect" / "Discutons" button previously
  only scrolled to `#contact`. Now `href` = `mailto:contact@yassineelidrissi.com` and an
  `onclick` copies the address to the clipboard before the mailto navigation (same toast as
  `Footer.astro`, Umami event `about-email-copy`).

## 2026-08-24 — Remove em dashes from site content

- Owner request. All remaining `—` in rendered site content replaced with standard
  punctuation (colon, comma, or `|` for compound titles). Touched: `src/i18n/ui.ts` (6
  strings), `src/pages/404.astro` (tab title), `src/content/projects/{en,fr}/biomimicry.md`
  (`title`, punctuation only), `public/llms.txt`. Code comments left as-is.

## 2026-08-24 — Fix 404 on FR navbar "Travaux" / "Contact" links

- `src/components/Navbar.astro` — in FR, on any non-home page, the navbar "Travaux"/"Contact"
  links 404'd. They were built via `getRelativeLocaleUrl(lang, "/#projects")` →
  `/fr/#projects`; the fragment never reaches the server, only `/fr/` does, and
  `build.format:'file'` never emits `dist/fr/index.html`. Fixed by reusing `homeHref` (already
  passed through `stripTrailingSlash()`) to build `${homeHref}#projects` / `#contact`.
  Same bug class as the 2026-07-28 `/fr/` fixes.

## 2026-07-28 — ProjectCard mobile spacing

- `src/components/ProjectCard.astro` — `<section>` moved from `space-y-lg` to
  `flex flex-col gap-lg`. Tailwind's `space-y` sibling selector (`:not([hidden])`) only
  excludes the `hidden` *attribute*, not the `.hidden` *class*, so a desktop-only heading
  (`hidden md:block`) still counted as a sibling on mobile and added a phantom `margin-top`.
  Flex `gap` only applies between rendered elements → immune. Verified by DOM measurement.

## 2026-07-28 — Analytics: consolidate on Umami

- `src/layouts/BaseLayout.astro` — three trackers ran at once (Umami Cloud, Simple Analytics,
  Hotjar) + a dead Contentsquare comment. Hotjar is a GDPR/CNIL problem (cookies + session
  recording without prior consent). Removed Hotjar + Simple Analytics + dead comment; Umami
  Cloud is the sole tracker. `data-sa-event` attributes / `sa_event()` removed from `Navbar`,
  `Footer`, `ProjectCard`, `AboutLayout`, `404`.
- Added `data-umami-event` to the two untracked conversions: CV download (`AboutLayout`,
  reusing the `trackingSlug` field) and outbound "Significant Work" clicks.
- Added a global rage-click / dead-click detection script (element + ~40px bucket, 1.5s
  window; 3 hits on interactive = rage, 2 on non-interactive = dead; skips active text
  selection). Low-traffic → treated as qualitative signal only.

## 2026-07-28 — Fix 404 on `/fr/` (logo link + language switcher)

- `/fr/` with a trailing slash 404'd on GitHub Pages — `build.format:'file'` emits
  `dist/fr.html`, never `dist/fr/index.html`, and `getRelativeLocaleUrl(locale, "/")` always
  appends the slash. Broke the logo/home link and the EN→FR switcher in `Navbar.astro`, the FR
  hreflang in `BaseLayout.astro`, and the `/fr/logos` `/fr/photography` redirect targets.
- `src/i18n/utils.ts` — new `stripTrailingSlash()` (keeps lone `"/"`, strips otherwise),
  applied in `getLocalizedPath()`, `Navbar.astro`, `BaseLayout.astro` (hreflang).
- `astro.config.mjs` — `/fr/logos` `/fr/photography` targets `/fr/` → `/fr`.
- Deliberate: fix at the source (generated URLs), not by switching `build.format` to
  `'directory'` (would change every URL on the site — explicit owner decision not to).
- `src/components/icons/FlagIcon.astro` — flag icons `20×20` → `17.5×17.5` (owner request).

## 2026-07-28 — FR publication: translations finalized, FR CV added, merged to `main`

- `src/content/projects/{en,fr}/{900care,batchcooking,caissedesdepots}.md` — FR copy
  finalized by the owner (titles, description, methodology, insights, delivery, metrics),
  minor EN typo fixes.
- `public/documents/` — FR CV added (`cv_UXPRODUCTDESIGNER_EL_IDRISSI_YASSINE.pdf`), EN CV
  replaced (`Resume_UXPRODUCTDESIGNER_EL_IDRISSI_YASSINE.pdf`, old
  `Resume_UXDESIGNEROPS_...` removed); `about.{en,fr}.ts` `cvLink` updated.
- `src/data/home.fr.ts` — stale `[FR TODO]` header comment removed (content was already
  translated).
- `lang` branch fast-forward merged to `main` and pushed — FR site live.

## 2026-07-28 — Remove raw CV file (personal phone number, public repo)

- `src/data/ELIDRISSI_Yassine_RESUME.md` deleted from the repo — raw CV notes (used to rebuild
  `about.fr.ts`) that contained the owner's personal phone number in clear, publicly visible.
- **Not resolved:** the number is still in Git history (commit `604a7ee`, pushed to public
  `origin/lang`). Full purge = history rewrite + force-push — owner decision. See `BACKLOG.md`.
- Wider privacy audit that day: no postal address / Gmail found elsewhere; the downloadable CV
  PDF was already redacted ("N° on demand").

## 2026-07-28 — CDC external link, `.link` token, 404 rebuild

- `src/content/projects/{en,fr}/caissedesdepots.md` — an owner-inserted `<a>` in `context`
  used double quotes nested inside a double-quoted YAML value → invalid YAML, broken build.
  Fixed to single quotes on the tag attributes (`href='...' target='_blank' rel='noopener'`).
- `src/layouts/ProjectLayout.astro` — string-case rendering of `context` / `problem` /
  `roleDescription` / `methodology` / `delivery` used raw interpolation, which escapes HTML →
  an inserted link showed as literal text. All five switched to `<p set:html={...} />`
  (matching `keyInsights` / `metrics`).
- `src/styles/tokens.js` — new `text-link` (gray-600) / `text-link-hover` (black) roles;
  `src/styles/global.css` — new `.link` component class; the 4 hardcoded link treatments in
  the `ProjectLayout` Credits section replaced with `class="link"`.
- `src/pages/404.astro` — rebuilt from existing primitives (removed inert Tailwind classes,
  a hardcoded-colour SVG with baked-in untranslatable text, and a nested `<main>`). One CTA
  ("Go home"); `page404.seeProjects` i18n key removed.

## 2026-07-27 — Section fields: optional + list-capable

- `src/content/config.ts` — `context`, `problem`, `roleDescription`, `keyInsights`,
  `methodology`, `delivery`, `metrics` → `z.union([z.string(), z.array(z.string())])` and
  `.optional()`. Every case-study section is now optional and can be a bulleted list.
- `src/layouts/ProjectLayout.astro` — `hasContent()` helper + `has*` booleans; a section's
  heading + body is hidden when its field is missing or empty. `contextSummary` /
  `metaDescription` added so meta description / JSON-LD stay flat text.
- `CLAUDE.md` — hard rule added: never edit owner-authored wording without explicit request,
  even as a side-effect of a structural change.

## 2026-07-26 — flag icons, commit attribution

- `src/components/icons/FlagIcon.astro` (new) — circular EN/FR flag icons from the owner's
  Figma component, unique `clipPath` id per instance (`randomUUID()`). Replaces the plain
  brand-colour dots in `Navbar.astro`.
- `.claude/settings.json` (new) — `attribution.commit` / `attribution.pr` set to `""` — Claude
  is never cited as co-author in this repo's commits/PRs. `CLAUDE.md` hard rule added.

## 2026-07-26 — Images single-source, discreet switcher, CLAUDE.md post-i18n

- `src/content/config.ts` — `cardImage` made optional (Zod) so `fr/*.md` can omit it.
- `src/content/resolveImages.ts` (new) — resolves missing `cardImage` / `projectImages` on an
  entry from the `en/` entry with the same `semanticSlug`, at build. Wired into
  `HomeLayout.astro` and `src/pages/fr/work/[slug].astro`.
- `cardImage` / `projectImages` removed from all 4 `fr/*.md` — images are edited in `en/*.md`
  only, propagated to every locale.
- `Navbar.astro` — language switcher redesigned per the owner's Figma export (minimal trigger,
  compact dropdown, colours verified 1:1 against tokens).

## 2026-07-26 — i18n FR scaffolding + FR content + SEO

- `astro.config.mjs` — native Astro `i18n` (`defaultLocale: 'en'`, `locales: ['en','fr']`,
  `prefixDefaultLocale: false`) + `@astrojs/sitemap` i18n option + mirrored `/fr/*` redirects.
- `src/i18n/ui.ts` + `src/i18n/utils.ts` (new) — UI translation dictionary and helpers
  (`useTranslations`, `getLocalizedPath`, `stripLocalePrefix`, `cleanPathname`).
- `src/content/projects/*.md` → moved into `src/content/projects/en/` (`git mv`), `fr/`
  created. Owner later added the 3 FR case studies.
- `src/components/pages/{Home,About}Content.astro` → moved to
  `src/layouts/{Home,About}Layout.astro` (aligns with `ProjectLayout` / `BaseLayout`). Rule
  made explicit: `pages/` = routing only, `layouts/` = composition, `components/` = UI atoms.
- `src/pages/work/[slug].astro` (EN) + `src/pages/fr/work/[slug].astro` (new) filter the
  collection by slug prefix (`en/`, `fr/`).
- `BaseLayout.astro` — dynamic `lang` (`Astro.currentLocale`), `og:locale` map, hreflang
  (en/fr/x-default). `inLanguage` (schema.org) added to `Person` + `CreativeWork` JSON-LD.
- `src/data/about.fr.ts` rebuilt from a newer CV; `about.en.ts` deliberately left older.
  Languages section added to `about.types.ts` + both locales.
- New `plainText()` helper (`i18n/utils.ts`) — decodes numeric HTML entities (`&#8209;`) for
  plain-text contexts (`<title>`, `alt`, JSON-LD) where `set:html` isn't used.
- `public/llms.txt` — updated: 3 FR case studies, bilingual mention, `inLanguage`.

_(Earlier history: `docs/archive/changelog-2026-07.md`.)_
