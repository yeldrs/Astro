# BACKLOG

Open items only — what's left to do. Read this at session start.
Done → one line in `CHANGELOG.md`, removed from here. Keep this file short.

Format: `- [ ] <area> — <what> — <why> (<severity>)`

## Content — owner decision needed

- [ ] `src/content/projects/caissedesdepots.yaml` — `en.methodology` / `en.delivery` are a
      plain string but `fr.methodology` / `fr.delivery` are a `string[]`, so the same project
      renders differently per locale. Pick one shape for both. (low — cosmetic)
- [ ] `src/content/projects/900care.yaml` — `keyInsights` list items are in a different order
      in `en` vs `fr`. Align if intentional parity is wanted. (low)
- [ ] `src/content/projects/batchcooking.yaml` — `credits.team[0].role` is `{ en: "…developer",
      fr: "…developper" }` — the FR is a typo carried over verbatim from the old content. Fix
      to one shared string on owner confirmation. (low)
- [ ] `src/data/about.fr.ts` — "Significant Work" section is an unverified EN→FR translation,
      never checked against the real CV (flagged in the file header). Owner to review. (low)
- [ ] `src/data/about.en.ts` vs `about.fr.ts` — intentionally out of sync (FR rebuilt from a
      newer CV, EN left older). Tracked, not drift. Revisit only if the owner asks. (info)

## Assets

- [ ] `public/documents/` — FR CV PDF: `about.fr.ts` `cvLink` points to a file the owner has
      not supplied yet → 404 on `/fr/about` download. (medium — broken link)
- [ ] Case-study `og:image` is still the WebP `cover` (home/about now use a JPEG). Export
      1200×630 JPEG covers if link previews on X/LinkedIn matter for case-study shares. (low)
- [ ] `src/components/Hero.astro` — profile `<img>` is commented out; `profile-pic.webp` is
      only used as JSON-LD / `personLd` image. Decide: show it, or drop the asset. (low)

## Design system

- [ ] `text-md` — used in `Button.astro`, `Footer.astro`, `HomeLayout.astro`, `404.astro`.
      No such class exists (not in tokens, not a Tailwind default) → silent no-op, size is
      inherited. Needs a deliberate pass with the owner to pick the intended size. (low)

## Tooling / infra

- [ ] `npm audit` — 20 advisories (mostly transitive dev deps via tailwind/postcss chain).
      Review after any dependency bump. (low)
- [ ] Optional: a `Stop` hook running `astro check` (Windows/PowerShell — verify it's robust
      before adding). (idea)

## Security — owner decision

- [ ] Git history: commit `604a7ee` (already pushed public) contains the owner's personal
      phone number in a since-deleted file. Full purge needs `git filter-repo`/BFG +
      force-push on a public branch — destructive, owner call. (medium)
