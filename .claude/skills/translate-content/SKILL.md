---
name: translate-content
description: >-
  Translate portfolio content between English and French (case studies or the
  About page). Use when the owner asks to translate a project, add the FR version
  of a case study, or sync a translation. Enforces faithful translation only.
---

# Translate content

## The rule (non-negotiable)

Translate **faithfully**. Never invent, embellish, add claims, or "improve" the copy. Keep
every number, metric, product name, and link exactly as in the source. If the source wording
seems wrong, flag it to the owner and wait — do not fix it in the translation.

## Case study (`src/content/projects/<name>.yaml`)

- The file already has an `en:` block. Add (or update) the `fr:` block with the **same shape**
  and the same keys that carry content.
- Translate: `title`, `description`, `role`, `roleDescription`, `context`, `problem`,
  `keyInsights`, `methodology`, `designConception.paragraph` / `.listItems`, `delivery`,
  `metrics`.
- `client` is per-locale — translate the institution name only if the owner uses a translated
  form (e.g. "Museum of Natural History" ↔ "Muséum d'Histoire Naturelle"); keep brand names
  as-is ("900.care").
- Keep the **structure** identical: if `en.methodology` is a `string[]`, make `fr.methodology`
  a `string[]` with the same number of items in the same order. (Some existing files are
  inconsistent here — that's tracked in `BACKLOG.md`, don't propagate it.)
- Do **not** touch `images`, `credits`, `semanticSlug`, `publishDate`, `isDraft` — shared,
  language-neutral.
- Preserve inline HTML (`<a href='…' class='link'>…</a>`) and translate only the link text.

## About page (`src/data/about.{en,fr}.ts`)

- These two files are **intentionally out of sync** (FR was rebuilt from a newer CV, EN left
  older — see `BACKLOG.md`). Do not "sync" them wholesale. Translate only the specific section
  the owner names.
- `href` / `trackingSlug` fields are technical — leave them, except `href` on `significantWork`
  which is locale-prefixed (`/work/…` vs `/fr/work/…`).

## Verify

- `npm run build` + `npm run check`.
- `npm run preview` → compare the FR page against the EN page section by section: same
  sections present, same figures, same numbers, same links.
- Add the new `/fr/work/<slug>` URL to `public/llms.txt`.
- Dated entry in `CHANGELOG.md`.
