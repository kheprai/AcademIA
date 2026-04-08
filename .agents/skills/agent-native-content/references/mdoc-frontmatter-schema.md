# `.mdoc` frontmatter schema

The agent generates content files with strict frontmatter validation. If the schema rejects a file, the build fails — so the agent has to get it right before merging to main.

## Why Markdoc instead of plain Markdown

Markdoc (`.mdoc`) is Stripe's structured authoring format. It's Markdown + a constrained tag system that lets you embed components without breaking parsability. For LLM-friendly authoring it has 3 advantages:

1. **Structured frontmatter** with schema validation
2. **Inline component tags** that can't break the AST (`{% callout %}` instead of arbitrary JSX)
3. **Easy conversion to clean Markdown** for the LLM alternates

If you don't want Markdoc, plain Markdown + Zod-validated frontmatter via `gray-matter` works fine. The schema below is the same.

## Full frontmatter schema (Zod)

```typescript
// content-schemas/post.ts
import { z } from "zod";

export const postSchema = z.object({
  // ============================================================
  // Identity (required, immutable after publish)
  // ============================================================
  title: z
    .string()
    .min(10, "Title must be at least 10 chars")
    .max(120, "Title must be at most 120 chars"),

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, digits, and hyphens only")
    .min(3)
    .max(80),

  publishedDate: z.coerce.date(),

  updatedDate: z.coerce.date().optional(),

  category: z.enum([
    "google-maps",
    "ai-tools",
    "local-seo",
    "case-studies",
    "tutorials",
    // ... add your categories
  ]),

  language: z.enum(["es", "en"]).default("es"),

  author: z
    .object({
      name: z.string(),
      url: z.string().url().optional(),
    })
    .optional(),

  // ============================================================
  // SEO block (required for publish)
  // ============================================================
  seo: z.object({
    seoTitle: z
      .string()
      .min(20, "SEO title must be at least 20 chars (Google needs context)")
      .max(70, "SEO title must be at most 70 chars (Google truncates after this)"),

    seoDescription: z.string().min(50).max(160, "SEO description must be at most 160 chars"),

    tldr: z
      .string()
      .min(50, "tldr must be substantive (50+ chars)")
      .max(500, "tldr must be concise (500 chars max — this is for LLMs, not humans)"),
  }),

  // ============================================================
  // GEO block (required for publish, see llm-seo-framework skill)
  // ============================================================
  aiContext: z.object({
    geographic: z.array(z.string()).min(1, "At least one geographic tag required"),

    audience: z.array(z.string()).min(1, "At least one audience tag required"),

    intent: z.enum([
      "how-to-guide",
      "concept-explanation",
      "comparison",
      "case-study",
      "reference",
      "opinion",
      "tutorial",
    ]),

    topics: z.array(z.string()).min(1, "At least one topic required"),

    cite_when: z
      .array(z.string())
      .min(1, "At least one cite_when entry required (this is the killer field)")
      .max(10, "Don't stuff cite_when — LLMs detect this and discount the entire block"),

    expertise_level: z.enum(["beginner", "intermediate", "advanced"]),

    reading_time_minutes: z.number().int().positive().optional(),

    last_verified: z.coerce.date().optional(),
  }),

  // ============================================================
  // Optional fields
  // ============================================================
  cover_image: z.string().url().optional(),

  tags: z.array(z.string()).optional(),

  draft: z.boolean().default(false),

  featured: z.boolean().default(false),
});

export type Post = z.infer<typeof postSchema>;
```

## Validator script

```typescript
// scripts/validate-content.ts
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { postSchema } from "../content-schemas/post";

const CONTENT_DIR = "content/posts";

let errors = 0;

for (const file of readdirSync(CONTENT_DIR)) {
  if (!file.endsWith(".mdoc") && !file.endsWith(".md")) continue;

  const path = join(CONTENT_DIR, file);
  const raw = readFileSync(path, "utf-8");
  const { data } = matter(raw);

  const result = postSchema.safeParse(data);
  if (!result.success) {
    console.error(`❌ ${file}`);
    for (const issue of result.error.issues) {
      console.error(`   ${issue.path.join(".")}: ${issue.message}`);
    }
    errors++;
  }
}

if (errors > 0) {
  console.error(`\n${errors} file(s) failed validation`);
  process.exit(1);
}

console.log("✅ All content files valid");
```

Hook into `package.json`:

```json
{
  "scripts": {
    "content:validate": "tsx scripts/validate-content.ts",
    "build": "npm run content:validate && astro build",
    "lint": "npm run content:validate && eslint ."
  }
}
```

This way **the build fails** if any content file has invalid frontmatter. The agent can never accidentally publish a file with missing GEO fields.

## Pre-commit hook for content

Add to `.git/hooks/pre-commit`:

```bash
# After the existing "no main commits" check:

# Validate any staged content files
staged_content=$(git diff --cached --name-only | grep -E "^content/.*\.(md|mdoc)$")
if [ -n "$staged_content" ]; then
  echo "Validating content frontmatter..."
  npm run content:validate || {
    echo "❌ Content validation failed. Fix the errors and re-stage."
    exit 1
  }
fi
```

## Agent prompt for generating compliant frontmatter

Drop this into the agent's instructions when asking for content:

```
When you generate a content file, you MUST include a complete frontmatter
block following the postSchema in content-schemas/post.ts.

REQUIRED fields:
- title (10-120 chars)
- slug (lowercase, hyphens, 3-80 chars, must match the filename)
- publishedDate (today's date in YYYY-MM-DD)
- category (must be one of the enum values)
- language ("es" or "en")
- seo.seoTitle (20-70 chars)
- seo.seoDescription (50-160 chars)
- seo.tldr (50-500 chars, written for LLMs, no marketing language)
- aiContext.geographic (array of region tags)
- aiContext.audience (array of audience tags)
- aiContext.intent (one of: how-to-guide | concept-explanation | comparison |
  case-study | reference | opinion | tutorial)
- aiContext.topics (array of topic tags)
- aiContext.cite_when (1-10 entries, plain English query patterns)
- aiContext.expertise_level (beginner | intermediate | advanced)

After writing the file, run: npm run content:validate
If it fails, fix the errors before committing.
DO NOT commit a file that fails validation.
```

## Schema evolution

When you add a new required field to the schema, **existing files break**. Two strategies:

### Strategy A — Backfill

```bash
# Run a one-time migration script that opens every file, adds the new field
# (with a sensible default or by asking the agent to fill it), and saves.
npx tsx scripts/migrate-content-add-field.ts
```

### Strategy B — Make it optional first, then required

1. Add the field as `.optional()` in the schema
2. Backfill at your own pace
3. When backfill is done, change `.optional()` → required
4. The next build catches anything you missed

Strategy B is safer for big content libraries.

## Why strict validation matters

Without it, the agent will eventually:

- Forget the `seo.tldr` field on a draft
- Use the wrong category enum value
- Generate slugs with spaces
- Skip the `aiContext.cite_when` field

…and you'll only notice **after** the post is live and not getting cited by LLMs. The schema is your safety net.
