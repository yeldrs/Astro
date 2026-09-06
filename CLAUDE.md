# CLAUDE.md

Operating context for `portfolio_2026` (yeldrs/portfolio_2026). Read this before any change.

## What this is

Static **Astro 5** portfolio for a UX / Product Designer. Zero server, zero database, zero
runtime logic — everything is pre-rendered at build (`output: 'static'`, `build.format: 'file'`).
Pushed to `main` → GitHub Actions → GitHub Pages. Hostinger is registrar + email (MX) only,
**not** the web host.

**Bilingual (EN/FR).** English at the root, unprefixed (`/work/900care`); French under `/fr/`
(`/fr/work/900care`). Native Astro `i18n` (`defaultLocale: 'en'`, `prefixDefaultLocale: false`).

Published case studies: 900.care, Caisse des Dépôts, Batchcooking. Draft: biomimicry
(`isDraft: true` — its `/images/biomimicry/*` don't exist yet, don't publish).

## Session start

1. Read **`BACKLOG.md`** — the single list of what's open / what's next. Small on purpose.
2. That's it. Do **not** read `CHANGELOG.md` in full (history, reference only — open one dated
   entry only when you need to know *why* a past change was made).
3. Deeper architecture rationale → `ARCHITECTURE.md`, on demand.
4. Exact content contract → `src/content/config.ts` (the Zod schema is the authority).

## Layer map — pick the layer before touching code

| I want to change… | Edit |
|---|---|
| Case-study copy / images / metrics | `src/content/projects/<name>.yaml` (one file, `en:` + `fr:` blocks) |
| Home or About page content | `src/data/{home,about}.{en,fr}.ts` |
| A user-facing UI label | `src/i18n/ui.ts` — **both** `en` and `fr`, read via `useTranslations()` |
| Colour / spacing / radius / type | `src/styles/tokens.js` only (never hardcode in a component) |
| Page composition / markup | `src/layouts/*.astro` (`pages/*.astro` stay thin: `getStaticPaths` + render) |
| Routing, redirects, integrations | `astro.config.mjs` (the only redirect source; mirror every `/fr/*`) |
| Build / deploy | `.github/workflows/deploy.yml` |

`src/components/` = shared UI atoms — check who imports one before editing it.

## Content model (case studies)

- **One YAML file per case study**: `src/content/projects/<name>.yaml`. Data collection
  (`type: "data"`), validated by `src/content/config.ts` (Zod). A file that fails the schema
  fails the build.
- **Shared, language-neutral** fields at the top level: `semanticSlug` (kebab-case, becomes the
  URL segment), `publishDate` (`YYYY-MM-DD`), `isDraft`, `cover`, `images`, `credits`.
- **Translated copy** under `en:` and `fr:` blocks, same shape: `title`, `client`,
  `description`, `role`, `roleDescription`, `context`, `problem`, `keyInsights`, `methodology`,
  `designConception`, `delivery`, `metrics`. `en:` is required. **`fr:` absent ⇒ no
  `/fr/work/<slug>` page** (not a bug).
- **Images are named, not positional**:
  ```yaml
  images:
    context:   { main: "/images/…", secondary: "" }
    role:      { main: "/images/…", secondary: "" }
    conception: { main: "…", secondary: "" }
    results:   { main: "…", secondary: "" }
    carousel:  ["/images/…", "…"]
  ```
  Images live in this one file (no per-locale duplication). Put files in
  `public/images/<project>/`.
- Section fields (`context`, `problem`, `roleDescription`, `keyInsights`, `methodology`,
  `designConception`, `delivery`, `metrics`) are each optional, accept a string **or** a
  `string[]` (rendered as a bulleted list). `ProjectLayout.astro` hides a section's heading +
  body when its field is missing or empty. Omitting the field is enough.
- `credits.team[].role` / `credits.references[].role` accept a string, or `{ en, fr }` when the
  role genuinely differs per locale.

## Design token chain

```
tokens.js (primitives → semantic) → tailwind.config.mjs → components (Tailwind classes)
```

`tailwind.config.mjs` colours = `{ ...tokens.semantic.colors }` (a spread, never a re-declared
map). Change a colour once in `tokens.js`, the whole cascade follows.

## Hard rules — never

- Never hardcode a colour / spacing / radius in a component — route through `tokens.js`.
- Never re-declare the colour map in `tailwind.config.mjs` — keep it `{ ...tokens.semantic.colors }`.
- Never hardcode a user-facing string in a component — add a key to **both** locales in `ui.ts`.
- Never edit the **wording** of any content the owner authored (case studies
  `src/content/projects/**`, CV/about `src/data/about.*.ts`, home `src/data/home.*.ts`, or any
  other owner text) without the owner's explicit request for that specific edit — not as a
  typo fix, not as a side-effect of a schema/layout change. Flag it, wait for confirmation.
  A faithful, clearly-flagged EN↔FR translation of copy the owner already wrote is fine when
  asked; inventing or embellishing claims is not.
- Never propose SSR, a database, or a runtime backend — the site is contractually 100% static.
- Never reintroduce resolved debt: duplicate redirect sources, a manual sitemap, a Google
  Fonts dependency, `deploy/test` as prod (prod is `main`), a `.htaccess`.
- Never credit Claude / an AI assistant as author or contributor — commits, PR descriptions,
  or the site. `.claude/settings.json` enforces empty commit/PR attribution; don't override it
  or re-add a "Co-Authored-By" / "Generated with" trailer.

If a request breaks one of these: stop, name the rule, propose the compliant alternative.

## Workflow

1. Identify the layer (table above). Don't blur layers in one change.
2. Content changes: check mentally against the Zod schema (`config.ts`) — required fields,
   kebab-case slug, `YYYY-MM-DD` date, translated copy in the `en:`/`fr:` blocks.
3. Design changes: `tokens.js` only.
4. Shared component: check its importers first.
5. Anything touching `astro.config.mjs` redirects, `deploy.yml`, or the schema: ask one
   targeted question rather than guess.
6. After any change, state what to verify: `npm run build` passes, which route is affected,
   whether a visual check is needed.
7. After a **major** change (feature, architecture, multi-file refactor, dependency/config
   change): add a dated entry to `CHANGELOG.md` and update `BACKLOG.md`. Skip for trivial
   edits (typos, one-liners, comment-only).

## Output conventions

- Full-file blocks for complete files, ready to paste, no placeholder comments.
- Minimal comments — only where logic is non-obvious (index mapping, workarounds).
- File identification: `.astro` → comment after the second `---`; other files → first line.
- No invisible / non-breaking characters, no decorative comments, no em dashes in site content.
