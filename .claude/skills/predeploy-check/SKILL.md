---
name: predeploy-check
description: >-
  Pre-push verification for the portfolio. Use before pushing to main, before
  opening a PR, or when asked to check the build is deploy-ready. Runs the build,
  type check, and a set of grep-based sanity checks on the output.
---

# Pre-deploy check

Run from the repo root.

## 1. Build + types

```bash
npm run build
npm run check     # astro check — expect 0 errors
```

A schema violation in a project file fails `build`. `check` catches type errors the build
skips.

## 2. Routing / i18n sanity (on `dist/`)

```bash
# No trailing-slash-before-fragment links (they 404 on GitHub Pages)
grep -rl '/fr/#' dist --include='*.html'          # expect: no output

# Canonical URLs are extensionless
grep -oE '<link rel="canonical" href="[^"]*"' dist/index.html dist/about.html

# hreflang present and reciprocal on a case study
grep -oE 'hreflang="[^"]*"' dist/fr/work/900care.html | sort -u   # en-US, fr-FR, x-default
```

## 3. Assets served

```bash
ls dist/robots.txt dist/sitemap-index.xml dist/CNAME
grep -c '<url>' dist/sitemap-0.xml               # expect 10 (home, about, 3 case studies x 2)
```

## 4. Images referenced vs present

```bash
# Every image path referenced in a project file must exist on disk
for f in src/content/projects/*.yaml; do
  grep -oE '/images/[^"]+\.webp' "$f" | while read -r p; do
    [ -f "public$p" ] || echo "MISSING: $p  (in $f)"
  done
done
```

## 5. Content ownership

```bash
git diff --stat main    # review: no unintended edits to owner copy
                         # (src/content/projects/**, src/data/about.*, src/data/home.*)
```

## 6. llms.txt

Open `public/llms.txt` — the case-study list must match the published projects (EN + FR).

If all clear: safe to push to `main` (auto-deploys) or open the PR.
