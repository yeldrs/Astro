---
name: add-case-study
description: >-
  Add a new case study (project) to the portfolio. Use when the owner wants to
  publish a new project, add a project file, or scaffold a case study. Covers the
  YAML file, the schema, images, the slug, drafts, and build verification.
---

# Add a case study

A case study is **one file**: `src/content/projects/<name>.yaml`. No route files to touch.

## Steps

1. **Copy a template.** `900care.yaml` is the most complete; `caissedesdepots.yaml` shows a
   carousel + `designConception.listItems`. Copy it to `src/content/projects/<name>.yaml`
   (`<name>` is a short filename, not necessarily the slug).

2. **Fill the shared (top-level) fields:**
   - `semanticSlug` — kebab-case (`^[a-z0-9]+(?:-[a-z0-9]+)*$`). Becomes the URL:
     `/work/<semanticSlug>` and `/fr/work/<semanticSlug>`.
   - `publishDate` — `"YYYY-MM-DD"`, quoted. Drives the home ordering (newest first).
   - `isDraft` — `true` while preparing (no page generated, not listed). Flip to `false` to
     publish.
   - `cover` — the card image, e.g. `/images/coverProject-<name>.webp`.
   - `images` — named, see below.
   - `credits` — `client: { link }` (the displayed name is taken from `<locale>.client`),
     `team: [...]`, `references: [...]`. Each entry: `{ name?, link?, role? }`. `role` may be
     `{ en, fr }` if it genuinely differs per locale (rare).

3. **Images.** Put files in `public/images/<project>/` (`.webp`). Reference them by section:
   ```yaml
   images:
     context:    { main: "/images/<project>/…", secondary: "" }
     role:       { main: "…", secondary: "" }
     conception: { main: "…", secondary: "" }
     results:    { main: "…", secondary: "" }
     carousel:   ["/images/<project>/…", "…"]
   ```
   `secondary` is optional (leave `""`). `main: ""` is allowed if a section has no image.

4. **Fill the `en:` block** (required): `title`, `client`, `description?`, `role`, and any of
   the section fields `roleDescription`, `context`, `problem`, `keyInsights`, `methodology`,
   `designConception` (`{ paragraph?, listItems? }`), `delivery`, `metrics`. Each section
   field is a string **or** a `string[]` (bulleted list). Omit a field to hide that section.

5. **Add the `fr:` block** when the French copy is ready — same shape. Omit it entirely to
   ship EN-only for now (no `/fr/work/...` page is generated).
   - Translating: use the `translate-content` skill. Never invent or embellish — faithful
     translation of copy the owner wrote only.

6. **`public/llms.txt`** — add the new case-study URLs (EN + FR if translated).

7. **Verify:** `npm run build` (fails on a schema violation) then `npm run check`. Preview
   with `npm run preview` and check `/work/<slug>` and `/fr/work/<slug>`.

8. If this is a real publish (not a tiny tweak): add a dated entry to `CHANGELOG.md`.

## Notes

- `<a href='…' class='link'>` inside a text field is allowed — fields render via `set:html`.
  Use **single quotes** for the tag attributes (the value is already in a YAML string).
- Non-breaking hyphen in a title: `&#8209;` (the layout decodes it for plain-text contexts).
- The Zod schema in `src/content/config.ts` is the contract — read it if a build error is
  unclear.
