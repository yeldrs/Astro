# CHANGELOG archive — July 2026

Archived from `CHANGELOG.md`. Reference only. The 2026-07-26 i18n work stayed in the main
changelog; this file holds the earlier 2026-07-11 architecture audit + cleanup.

---

## 2026-07-11 — Architecture audit + cleanup (multi-session)

### Scoping decisions (owner-validated)
- Hosting: domain + email at Hostinger (registrar / MX). The **site** is served by GitHub
  Pages (`CNAME` + `deploy.yml`). `.htaccess` (Apache) was dormant.
- Contact = email copy via `Footer.astro`; the fake Formspree `ContactFormSection` was removed.

### Cleanup — orphans / cruft
- Deleted: `.github/agents/assistant.agent.md` (empty), `src/components/Welcome.astro` (Astro
  starter orphan), `src/components/ContactFormSection.astro` (orphan + fake endpoint),
  `public/images/profile-pic1.jpg` (unreferenced dup), `validate-frontmatter.cjs` (broken:
  needs `gray-matter`, absent; redundant with the Zod schema), the manual `public/sitemap.xml`.
- `public/.htaccess` — cleaned then removed. Redirects consolidated to a single source
  (`astro.config.mjs`, which emits `aboutme/logos/photography/projects/work.html` at build).
- `README.md` — Astro template → real README.
- `repomix-output.xml` — untracked (`git rm --cached`) + `.gitignore`d (regenerable).
- `package.json` — metadata: name `astro` → `portfolio-yassine-el-idrissi`, version → 1.0.0.

### Design system consolidation ("do not touch" lifted by the owner)
- `src/styles/tokens.js` — restructured into the single source of truth: `primitives` +
  `semantic` layer that references real values (no `"{...}"` placeholders). The stale
  turquoise `semantic.colors` block replaced by the operational violet `accent-action` map.
  Values kept identical → 0 visual change.
- `tailwind.config.mjs` — now consumes `{ ...tokens.semantic.colors }` instead of a
  hand-written map. Ends the double source / divergence permanently.
- Dead palettes removed (`blue-chill`, `accent-deco` — identical to `accent-action`);
  `Cloud.astro` repointed to `accent-action` (consumes the token in JS directly).
- BUG 1: `text-text-body` (non-existent token) → `text-text-body-primary` in
  `work/[slug].astro` (11×). BUG 2: new `stroke-secondary` token (gray-200); the `Footer` /
  `about` separators were rendering in `currentColor` (dark) → now light grey.

### Sitemap / fonts / SEO
- `@astrojs/sitemap` added to integrations → `dist/sitemap-index.xml` at build (drafts +
  redirects auto-excluded). `robots.txt` points to `/sitemap-index.xml`.
- Self-hosted fonts — Google Fonts replaced by 3 variable woff2 (latin subset) in
  `public/fonts/` + `@font-face` in `global.css`; preconnect/link removed, 2 `preload` added.
  Kills a render-blocking third-party dependency (perf + GDPR).
- `BaseLayout.astro` — `lang="fr"` → `lang="en"` (all content is English); per-page
  `<link rel="canonical">` in clean (extensionless) form; Open Graph + Twitter Card; JSON-LD
  `Person` site-wide; new `image` + `structuredData` props. `theme-color` `#367984` → `#4364e8`.
- `src/pages/work/[slug].astro` — per-case-study JSON-LD `CreativeWork`.
- `index.astro` / `about.astro` — per-page meta descriptions.
- `public/llms.txt` — created (site summary for AI agents).
- `robots.txt` — AI crawlers explicitly allowed (GPTBot, OAI-SearchBot, ChatGPT-User,
  ClaudeBot, PerplexityBot, Google-Extended); useless `Disallow`s removed.
- `getStaticPaths` in `work/[slug].astro` now filters drafts (`isDraft !== true`) — the home
  filtered them but the detail route still generated their pages.
- `biomimicry.txt` → `biomimicry.md` with `isDraft: true` (no page generated; images still
  missing).
- Code comments FR → EN across 21 source files (comments only). Narrative docs left in FR.

### Deploy / branches
- `deploy.yml` trigger `deploy/test` → `main`; `main` created and pushed as prod.

### Debt recorded that day (later resolved or still tracked)
- Resolved since: design-system double source, manual sitemap, render-blocking fonts,
  `.htaccess`, `validate-frontmatter.cjs`, canonical/OG/JSON-LD/llms.txt, `deploy/test` as prod.
- Still tracked (see `BACKLOG.md`): `projectImages` positional mapping fragility,
  `ProjectLayout.astro` density, `astro:assets` not used.
