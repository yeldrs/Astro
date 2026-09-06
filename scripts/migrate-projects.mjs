// scripts/migrate-projects.mjs
// One-shot: src/content/projects/{en,fr}/<name>.md  ->  src/content/projects/<name>.yaml
// Strings are copied VERBATIM. Positional projectImages -> named images.
// Delete this file (and the docs/_migration-source copy) once the migration is validated.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, cpSync } from "node:fs";
import { join } from "node:path";
import { parse, stringify } from "yaml";

const SRC = "src/content/projects";
const names = readdirSync(join(SRC, "en"))
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""));

const readFrontmatter = (file) => {
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) throw new Error(`No frontmatter in ${file}`);
  return parse(m[1]);
};

const SECTION_FIELDS = [
  "roleDescription",
  "context",
  "problem",
  "keyInsights",
  "methodology",
  "delivery",
  "metrics",
];

const localeBlock = (fm) => {
  const out = {
    title: fm.title,
    client: fm.client,
    ...(fm.description !== undefined ? { description: fm.description } : {}),
    role: fm.role,
  };
  for (const f of SECTION_FIELDS) {
    if (fm[f] !== undefined) out[f] = fm[f];
  }
  const dc = fm.designConception;
  if (dc && (String(dc.paragraph ?? "").trim() || (dc.listItems ?? []).length)) {
    out.designConception = {};
    if (String(dc.paragraph ?? "").trim()) out.designConception.paragraph = dc.paragraph;
    if ((dc.listItems ?? []).length) out.designConception.listItems = dc.listItems;
  }
  return out;
};

// team / references: language-neutral except a role string that occasionally differs.
const mergeCredits = (enArr = [], frArr = []) =>
  enArr.map((e, i) => {
    const f = frArr[i] ?? {};
    const entry = {};
    if (e.name !== undefined) entry.name = e.name;
    if (e.link !== undefined) entry.link = e.link;
    if (e.role !== undefined || f.role !== undefined) {
      entry.role = e.role === f.role || f.role === undefined ? e.role : { en: e.role, fr: f.role };
    }
    return entry;
  });

for (const name of names) {
  const en = readFrontmatter(join(SRC, "en", `${name}.md`));
  const fr = readFrontmatter(join(SRC, "fr", `${name}.md`));

  const pi = en.projectImages ?? [];
  const doc = {
    semanticSlug: en.semanticSlug,
    publishDate: en.publishDate,
    isDraft: en.isDraft ?? false,
    cover: en.cardImage,
    images: {
      context: { main: pi[0] ?? "", secondary: pi[1] ?? "" },
      role: { main: pi[2] ?? "", secondary: pi[3] ?? "" },
      conception: { main: pi[4] ?? "", secondary: pi[5] ?? "" },
      results: { main: pi[6] ?? "", secondary: pi[7] ?? "" },
      carousel: pi.slice(8).filter((s) => s !== ""),
    },
    credits: {
      ...(en.clientDetails?.link ? { client: { link: en.clientDetails.link } } : {}),
      team: mergeCredits(en.teamMembers, fr.teamMembers),
      references: mergeCredits(en.references, fr.references),
    },
    en: localeBlock(en),
    fr: localeBlock(fr),
  };

  // Force-quote scalars YAML would otherwise coerce (dates, digit-leading slugs).
  const yaml = stringify(doc, { lineWidth: 0 })
    .replace(/^(publishDate): (.+)$/m, '$1: "$2"')
    .replace(/^(semanticSlug): (.+)$/m, '$1: "$2"');
  writeFileSync(join(SRC, `${name}.yaml`), yaml);
  console.log(`wrote ${name}.yaml`);
}

// Preserve the source .md outside the build for validation review.
mkdirSync("docs/_migration-source", { recursive: true });
cpSync(join(SRC, "en"), "docs/_migration-source/en", { recursive: true });
cpSync(join(SRC, "fr"), "docs/_migration-source/fr", { recursive: true });
console.log("copied source .md -> docs/_migration-source/");
