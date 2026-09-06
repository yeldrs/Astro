# ARCHITECTURE

The *why* behind `portfolio_2026`. Read on demand — day-to-day rules are in `CLAUDE.md`,
open items in `BACKLOG.md`, history in `CHANGELOG.md`.

Audience: a developer taking over maintenance, and a designer touching the design system.

---

## 1. What the site is

Personal portfolio for a UX / Product Designer. Single-page home + one detail page per case
study. **100% static** — no server, no database, no runtime logic. Everything is pre-rendered
at build and served as flat files by GitHub Pages.

Repo: `github.com/yeldrs/portfolio_2026`. Default & production branch: `main`. Every push to
`main` triggers `.github/workflows/deploy.yml` → GitHub Pages. Hostinger is the domain
registrar and email (MX) provider only; the DNS points at GitHub Pages.

Bilingual: English at the root (unprefixed), French under `/fr/`. Three published case studies
(900.care, Caisse des Dépôts, Batchcooking) + one draft (biomimicry).

## 2. Stack

| Layer | Tech | Role |
|---|---|---|
| Framework | Astro `^5` | Static generation, routing, components |
| Content | Content Collections (`type: "content"`, `.md`) | Case studies = typed frontmatter |
| Styles | Tailwind CSS `^3` via `@astrojs/tailwind` | Utilities driven by design tokens |
| Design tokens | `src/styles/tokens.js` (plain JS) | Single source of truth for colour/space/type |
| Build CSS | PostCSS + autoprefixer | Tailwind compilation |
| Types | TypeScript strict (`astro/tsconfigs/strict`) | Schema validation, editor safety |

Scripts: `npm run dev` / `build` / `preview`. (`check` is added in the tooling phase.)

## 3. Routing

Astro's file-based routing. `build.format: 'file'` → emits `/about.html`, not
`/about/index.html`. `trailingSlash: 'ignore'` tolerates both URL forms.

```
src/pages/index.astro            → /
src/pages/about.astro            → /about
src/pages/404.astro              → 404 (one page, English only — GitHub Pages serves a single 404.html)
src/pages/work/[slug].astro      → /work/<semanticSlug>   (EN case studies)
src/pages/fr/index.astro         → /fr
src/pages/fr/about.astro         → /fr/about
src/pages/fr/work/[slug].astro   → /fr/work/<semanticSlug> (FR case studies)
```

### Why a real file per locale
Astro's native `i18n` (`defaultLocale: 'en'`, `locales: ['en','fr']`,
`prefixDefaultLocale: false`) keeps English unprefixed at the root. Astro has **no built-in
way** to share one `[locale]` route file while leaving the default locale unprefixed, so each
route exists twice: `work/[slug].astro` + `fr/work/[slug].astro`. They must stay in sync.

### The `build.format: 'file'` trap
No `dist/fr/index.html` is ever emitted (only `dist/fr.html`). So any generated URL that hits
`/fr/` with a trailing slash 404s on GitHub Pages, and fragment links must be `/fr#projects`,
not `/fr/#projects`. `src/i18n/utils.ts` exists largely to work around this:
`cleanPathname()`, `stripLocalePrefix()`, `stripTrailingSlash()`, `getLocalizedPath()`.
This has bitten the logo link, the language switcher, hreflang, navbar fragment links, and
redirect targets — all fixed at the source rather than by switching `build.format` (which
would change every URL on the site).

### Redirects
`astro.config.mjs` `redirects` is the **only** source (no `.htaccess`). Each entry builds a
meta-refresh HTML page at build (`dist/work.html`, `dist/fr/work.html`, …). Every EN entry has
a mirrored `/fr/*` entry.

## 4. The core mechanism: Content Collections + getStaticPaths

```
.md frontmatter → validated by src/content/config.ts (Zod) → read by getStaticPaths()
  in work/[slug].astro (or fr/…) → images resolved via resolveImages.ts → HTML page
```

If a `.md` file fails the schema, **the build fails** — the only guardrail against publishing
a malformed case study. `semanticSlug` becomes the URL segment and is identical across
locales, so there's no slug translation table to maintain.

- **EN route**: `getCollection("projects", ({slug}) => slug.startsWith("en/"))`, filters
  drafts, passes the entry straight through (it already has its images).
- **FR route**: gets the full collection, filters `fr/` + non-draft, runs `withResolvedImages`
  to inherit images from the `en/` sibling, then renders.
- No `fr/*.md` for a project ⇒ no `/fr/work/...` page. Expected, not a bug.

### Image single-source convention
`cardImage` and `projectImages` are authored **once**, in the `en/*.md` entry, and are
optional in the schema so `fr/*.md` omits them. `src/content/resolveImages.ts`
(`withResolvedImages`) fills them in for any entry missing them by looking up the `en/` entry
with the same `semanticSlug`, at build. Editing an image = editing the `en/` file only.

### `projectImages` positional index
Positions are semantic, not sequential. Never reorder or compact; keep empty `""` slots:

```
0 / 1  → context  (main / optional secondary)
2 / 3  → role
4 / 5  → conception
6 / 7  → results
8+     → carousel
```

`ProjectLayout.astro` reads these exact positions. A shift breaks the layout **with no build
error** — the single most dangerous edit for a non-developer. A keyed object is the intended
future shape (see `BACKLOG.md` / the restructuring plan).

### Section fields
`context`, `problem`, `roleDescription`, `keyInsights`, `methodology`, `designConception`,
`delivery`, `metrics` are each optional and accept a string **or** `string[]` (rendered as a
bulleted list). `ProjectLayout.astro` computes a `has*` boolean per field and hides that
section's heading + body when the value is missing or empty. Omitting the field is enough.

## 5. Home / About content

Plain typed TS in `src/data/` (`home.{en,fr}.ts`, `about.{en,fr}.ts` + `*.types.ts`) — **not**
a Content Collection. Deliberate: this content changes rarely and the `*.types.ts` interfaces
already give the safety a Zod schema would, without a nested-array schema. The trade-off is no
build-time validation — a missing comma breaks the build with an unclear message.

`about.en.ts` and `about.fr.ts` are intentionally **out of sync in richness** (FR rebuilt from
a newer CV, EN left as the older version). This is a chosen state, not drift — don't "fix" it.

## 6. i18n details

- **UI strings**: `src/i18n/ui.ts` — one dictionary, `en` + `fr` objects. `UiKey` is
  `keyof (typeof ui)["en"]`, so a missing FR key **won't compile** in strict mode — the two
  locales can't silently drift apart on *keys* (a value left in English still can). `t()` from
  `useTranslations(lang)` falls back to the default locale.
- **`utils.ts`** exports: `useTranslations`, `cleanPathname`, `stripLocalePrefix`,
  `stripTrailingSlash`, `getLocalizedPath`, `plainText`. `plainText` decodes numeric HTML
  entities (case-study titles carry `&#8209;` for a non-breaking hyphen, meant for `set:html`)
  so `<title>` / `alt` / JSON-LD don't double-escape them.
- **Locale → BCP-47** (`en-US` / `fr-FR`) currently appears in several places (BaseLayout,
  Navbar, sitemap config, ui.ts); consolidating it into one module is a tracked cleanup.

## 7. Layers

```
src/pages/      → routing only. A file here = getStaticPaths + a <Layout lang="…"/> render.
src/layouts/    → actual page composition (markup lives here).
                  BaseLayout  → <head>, SEO (canonical/hreflang/OG/Twitter/JSON-LD), fonts,
                                favicons, Navbar + <main><slot/></main> + Footer, the
                                rage/dead-click analytics script.
                  HomeLayout  → home body (takes lang).
                  AboutLayout → about/CV body (takes lang).
                  ProjectLayout → case-study template (takes project + lang), self-wraps in
                                  BaseLayout. Large: the Diagnosis/Conception/Results section
                                  block and the clickable-image block each repeat ~8×; the
                                  fullscreen image modal is an inline script. Extraction into
                                  ProjectSection / ProjectFigure components is planned.
src/components/  → shared UI atoms (Container, Button, ArrowButton, Navbar, Footer,
                  ProjectCard, ProjectCarousel, Cloud, …). Check importers before editing.
src/data/       → home/about content, one file per locale.
src/i18n/       → ui.ts (strings) + utils.ts (helpers).
src/content/    → config.ts (schema), resolveImages.ts, projects/{en,fr}/*.md.
src/styles/     → tokens.js, global.css.
```

## 8. Design system (designer section)

Three levels, abstract → concrete:

```
tokens.js primitives   →   tokens.js semantic.colors   →   component .astro
"#4364e8"               →   "background-brand"          →   class="bg-background-brand"
                            ↑ consumed as-is by tailwind.config.mjs
```

- **Level 1 — `primitives`**: raw values. Brand colour = the `accent-action` palette (violet),
  50 → 950. Plus a grey ramp, `surface.page`, and white/black.
- **Level 2 — `semantic.colors`**: role names (`background-brand`, `text-body-primary`,
  `button-background-primary`, `stroke-secondary`, `text-link`, …) that reference the
  primitives by real value.
- **Level 2b — `tailwind.config.mjs`**: `colors: { ...tokens.semantic.colors }` — a spread,
  nothing hand-written. Font sizes / spacing / radii are re-listed key by key from
  `tokens.primitives` (not a spread).
- **Level 3 — components**: use the semantic classes, never a hex value.

Change the brand colour everywhere = change one value in `tokens.js` (a primitive, or repoint
a role). The whole cascade — Tailwind included — follows.

Fonts: Manrope (sans / body) + Lora (serif / display headings), self-hosted variable woff2
(latin subset) via `@font-face` in `global.css`, declared `font-sans` / `font-serif` in
`tailwind.config.mjs`, preloaded in `BaseLayout.astro`. No Google Fonts. Heading convention:
H1 `text-4xl`, H2 `text-3xl`, H3 `text-lg`.

Spacing scale: `xxs` (2px) → `6xl` (112px). Radii: `md` (6px), `xl` (12px), `2xl` (16px),
`card` (12px).

### Known token-chain gaps (see `BACKLOG.md`)
- `bg-gray-*` / `border-gray-*` / `text-xs` fall back to Tailwind defaults — `tokens.primitives`
  `gray` and `fontSize.xs` are defined but not wired into the Tailwind override. Values are
  near-identical (`#d1d5dc` vs `#d1d5db`) but it's an open hole in "tokens only".
- `text-md` is used in a few components but is not a real class anywhere → silent no-op.

## 9. SEO / AI discoverability

All centralised in `BaseLayout.astro` (site-wide) + `ProjectLayout.astro` (per case study) —
nothing to copy per page, pass props.

- **Canonical**: every page emits `<link rel="canonical">` in clean (extensionless) form.
  Never hardcode a `.html` URL.
- **hreflang**: `en-US`, `fr-FR`, `x-default` — built by stripping the `/fr` prefix then
  rebuilding per locale.
- **Open Graph + Twitter Card**: default `og:image` = `/images/og-default.jpg` (1200×630
  JPEG); case studies override with their `cover`.
- **JSON-LD**: a `Person` site-wide + a `CreativeWork` per case study (via the
  `structuredData` prop). The main lever for both Google and LLMs.
- **`public/llms.txt`**: markdown summary for AI agents — update it when a project is
  added/removed.
- **`public/robots.txt`**: AI crawlers explicitly allowed + `Sitemap:` line. Must live in
  `public/` to be served.
- **Sitemap**: generated at build by `@astrojs/sitemap` → `dist/sitemap-index.xml` with
  hreflang. No manual file.

## 10. Adding a case study

Drop a `.md` in `src/content/projects/en/` (frontmatter + images). Add the `fr/` counterpart
when the translation is ready — same `semanticSlug`, **no image fields**. Put images in
`public/images/<project>/`. `npm run build` — if it passes, the project is live on the home
and at `/work/<semanticSlug>`. Zero route files to touch. (A guided procedure lives in the
`add-case-study` skill.)

## 11. Migrating away from GitHub Pages (if ever)

Recreate a `.htaccess` (recoverable from git history) to carry the redirects, force HTTPS, and
hide `.html`. Check that `public/CNAME` and `astro.config.mjs` `site:` agree on the domain.
Nothing else is host-specific.
