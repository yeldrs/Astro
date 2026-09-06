// src/content/config.ts
//
// One YAML file per case study: src/content/projects/<name>.yaml
//   - shared, language-neutral fields at the top level (slug, date, images, credits)
//   - translated copy under `en:` / `fr:` blocks (same shape)
//   - `fr` absent  ⇒  no /fr/work/<slug> page is generated (not a bug)
// The Zod schema is the contract: a file that fails it fails the build.

import { defineCollection, z } from "astro:content";

// A section field: a paragraph, or a bulleted list. ProjectLayout hides the
// section entirely when the value is missing or empty.
const section = z.union([z.string(), z.array(z.string())]).optional();

// A string that is normally language-neutral but occasionally differs per locale.
const i18nString = z.union([z.string(), z.object({ en: z.string(), fr: z.string() })]);

// Main + optional secondary image for one case-study section.
const figure = z
  .object({
    main: z.string().default(""),
    secondary: z.string().default(""),
  })
  .default({});

const localeContent = z.object({
  title: z.string(),
  client: z.string(),
  description: z.string().optional(),
  role: z.string(),
  roleDescription: section,
  context: section,
  problem: section,
  keyInsights: section,
  methodology: section,
  designConception: z
    .object({
      paragraph: z.string().optional(),
      listItems: z.array(z.string()).optional(),
    })
    .optional(),
  delivery: section,
  metrics: section,
});

const creditEntry = z.object({
  name: z.string().optional(),
  link: z.string().url().optional(),
  role: i18nString.optional(),
});

const projects = defineCollection({
  type: "data",
  schema: z.object({
    semanticSlug: z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "semanticSlug must be kebab-case (lowercase, digits, hyphens).",
      ),
    publishDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "publishDate must be an ISO date (YYYY-MM-DD)."),
    isDraft: z.boolean().default(false),

    cover: z.string(),
    images: z.object({
      context: figure,
      role: figure,
      conception: figure,
      results: figure,
      carousel: z.array(z.string()).default([]),
    }),

    credits: z
      .object({
        // Displayed name comes from `<locale>.client`; only the link lives here.
        client: z.object({ link: z.string().url().optional() }).optional(),
        team: z.array(creditEntry).default([]),
        references: z.array(creditEntry).default([]),
      })
      .default({}),

    en: localeContent,
    fr: localeContent.optional(),
  }),
});

export const collections = { projects };
