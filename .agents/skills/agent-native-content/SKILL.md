---
name: agent-native-content
description: "Set up an AI agent to author content for a static/headless site as if it were a software engineer: branch isolation (never push to main), strict frontmatter validation on .mdoc files, hybrid review cycle (Keystatic admin / local / IDE / GitHub web), merge-triggered auto-deploy. Companion skill to llm-seo-framework. Use when building a content pipeline where an AI agent drafts posts/articles/courses and a human reviews before publish."
---

# Agent-Native Content

## Origin

This skill is the operational distillation of the **content authoring side** of the "Agent-Native" framework designed by Rodrigo González (Kheprai) for `blog.mostrador.ar`. The full original article ships at `references/SEO-LLM-Framework-original.md` (in the companion `llm-seo-framework` skill) and is the source of truth.

## When to use

Use this skill when:

- You're building a **content site** (blog, news, knowledge base, course catalog) where an AI agent drafts content and a human reviews/edits/publishes
- The content lives in **files in a git repo** (Markdown, MDX, Markdoc, Asciidoc) — not in a database CMS
- You want **AI to do the 80%** of structural work (frontmatter, draft body, related links, meta) and **a human to do the 20%** of strategic editing
- You need a **safe failure mode**: AI hallucinations or bad drafts must NEVER reach production
- You want **deploy-on-merge** semantics (Vercel / Netlify / Cloudflare Pages / similar)

Do **not** use this skill when:

- Content lives in a database (Sanity, Strapi, Contentful, Prismic) — those have their own draft/publish primitives
- You're authoring with multiple humans simultaneously and merge conflicts in markdown files would be a nightmare
- You don't want any automation; you'd rather just write everything yourself

## The core principle

**Operador → Director**. Stop being someone who clicks. Become someone who defines intentions.

> "How most people use AI: they ask it 'write a post' and bla bla.
> What I ask my AI: 'deploy a new content feature.'"
> — _blog.mostrador.ar_

The AI agent doesn't "generate text". It **executes a content engineering workflow**: branch out, write a structured file, validate the schema, push, wait for human review, merge on approval, deploy, clean up.

## Hard rules (the agent's contract)

These rules are **non-negotiable** and must be embedded in the agent's system prompt or in a `CLAUDE.md` / `AGENTS.md` at the repo root.

### Rule 1 — NEVER push to main directly

```
⚠️ CRITICAL: Never Push Directly to Main.
```

The agent **always** starts content work with:

```bash
git checkout main
git pull origin main
git checkout -b draft/<slug-of-the-content>
```

If the agent finds itself on `main` and about to commit content, **abort**. The check belongs in a pre-commit hook too:

```bash
# .git/hooks/pre-commit
branch=$(git symbolic-ref --short HEAD)
if [ "$branch" = "main" ]; then
  if git diff --cached --name-only | grep -q "^content/"; then
    echo "❌ Refusing to commit content/ files directly to main."
    echo "   Use: git checkout -b draft/<slug>"
    exit 1
  fi
fi
```

### Rule 2 — Strict frontmatter schema

The agent does NOT generate plain text. It generates `.mdoc` (or `.md` / `.mdx`) files with frontmatter validated by a schema. If the schema rejects it, **the build fails** and the content is not saved.

Example schema for a blog post (using Zod or similar):

```typescript
// content-schemas/post.ts
import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(10).max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  publishedDate: z.coerce.date(),
  category: z.enum(["google-maps", "ai-tools", "local-seo", "case-studies"]),
  language: z.enum(["es", "en"]).default("es"),
  seo: z.object({
    seoTitle: z.string().min(20).max(70),
    seoDescription: z.string().min(50).max(160),
    tldr: z.string().min(50).max(500),
  }),
  aiContext: z.object({
    geographic: z.array(z.string()).min(1),
    audience: z.array(z.string()).min(1),
    intent: z.enum([
      "how-to-guide",
      "concept-explanation",
      "comparison",
      "case-study",
      "reference",
      "opinion",
      "tutorial",
    ]),
    topics: z.array(z.string()).min(1),
    cite_when: z.array(z.string()).min(1),
    expertise_level: z.enum(["beginner", "intermediate", "advanced"]),
  }),
});
```

The agent must populate **all required fields** before the file can be merged. If a field is missing, the validator complains and the agent has to fix it before pushing.

See `references/mdoc-frontmatter-schema.md` for the full reference schema.

### Rule 3 — One draft branch per content idea

Branch naming convention: `draft/<slug>`. Example:

```
draft/como-conseguir-resenas-google
draft/comparativa-cms-headless-2026
draft/case-study-ferreteria-mendoza
```

**One branch = one content piece**. Don't batch. If the agent has 3 ideas, it makes 3 branches.

### Rule 4 — Push → no deploy

When the agent pushes a `draft/...` branch to `origin`, **Vercel/Netlify/etc must NOT deploy**. Configure your platform to only build/deploy on `main`:

- **Vercel**: Project Settings → Git → Production Branch → `main`. Disable "Automatically expose system environment variables" preview deployments if you don't want preview URLs.
- **Netlify**: Site settings → Build & deploy → Deploy contexts → Production branch → `main`. Disable branch deploys.
- **Cloudflare Pages**: Settings → Builds & deployments → Production branch → `main`. Set "Preview branch deployments" to "None".

If you DO want preview URLs for human review of drafts, allow preview deployments on `draft/*` but make it explicit. The default should be off.

### Rule 5 — Human approval is the merge

The merge from `draft/<slug>` to `main` is the **explicit human approval step**. The agent **never** runs this merge. Only a human (via CLI, GitHub web UI, or approved automation) merges to main.

After merge, deploy is automatic. After deploy, the agent (or a cleanup hook) deletes the merged branch:

```bash
git push origin --delete draft/<slug>
git branch -d draft/<slug>
```

## The full flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Human gives intent                                       │
│    "Write a guide about prompts for legal professionals"    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. AI agent creates draft                                   │
│    └─> git checkout -b draft/prompts-para-abogados         │
│        └─> Generates content/prompts-para-abogados.mdoc    │
│            with full frontmatter (validated)               │
│            └─> Drafts the body in clean Markdown           │
│                └─> git commit -m "draft: prompts abogados" │
│                    └─> git push origin draft/...           │
│                        └─> ❌ NO deploy                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Human reviews via one of:                                │
│    A. Keystatic admin (visual editor on draft branch)       │
│    B. Local: git fetch && git checkout draft/...           │
│       npm run dev → review at localhost                    │
│    C. IDE: open the .mdoc file directly                    │
│    D. GitHub web editor on the draft branch                │
│                                                             │
│    Edits get committed back to draft/...                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Human approves                                           │
│    └─> git checkout main                                   │
│        └─> git merge draft/prompts-para-abogados           │
│            └─> git push origin main                        │
│                └─> ✅ Vercel/Netlify auto-deploy            │
│                    └─> Article live at site                │
│                        └─> Cleanup: delete draft/...       │
└─────────────────────────────────────────────────────────────┘
```

## Stack assumptions

This skill assumes a stack roughly like:

| Layer                   | Original Mostrador stack | Common alternatives                                               |
| ----------------------- | ------------------------ | ----------------------------------------------------------------- |
| Site framework          | **Astro**                | Hugo, Eleventy, Next.js (static), Nuxt (static), SvelteKit static |
| Content format          | **Markdoc (.mdoc)**      | MDX, Markdown + frontmatter, Asciidoc                             |
| Visual admin (optional) | **Keystatic**            | Tina, Decap CMS (formerly Netlify CMS), Pages CMS                 |
| Hosting                 | **Vercel**               | Netlify, Cloudflare Pages, GitHub Pages                           |
| Schema validation       | **Zod**                  | Yup, custom JSON Schema                                           |
| Agent platform          | Claude Code / Cursor     | Aider, Continue, custom                                           |

The skill is **stack-agnostic in principle** but the operational details (commands, hooks, validators) need to match your actual stack. The references in this skill use the Mostrador stack as the canonical example.

## Why this beats traditional CMSes

The original article makes the case explicitly:

1. **Velocidad absurda** — static site, no DB queries, instant load
2. **Propiedad real** — content lives in your git repo. If your CMS provider 5x's their pricing tomorrow, you don't care. You own everything.
3. **Evolución constante** — want to translate the entire blog to Portuguese? Tell the agent: "go through `/content`, create branches, translate each file keeping frontmatter intact." It happens in minutes.
4. **Eficiencia para tu agente** — the agent's natural habitat is CLI, terminal, git, markdown. Don't fight it. Give it those tools.

## Reference files

- **`references/SEO-LLM-Framework-original.md`** _(in companion skill)_ — the original article in full
- **`references/git-flow-diagram.md`** — the full ASCII diagram + step-by-step commands
- **`references/mdoc-frontmatter-schema.md`** — Zod schema for content frontmatter validation
- **`references/agent-system-prompt.md`** — drop-in system prompt for an AI agent that follows these rules
- **`references/keystatic-config-example.md`** — Keystatic admin config for the schema

## Companion skill

This skill is paired with **`llm-seo-framework`**, which describes the **delivery side** — how to serve the content so LLM agents can discover, ingest, and cite it (markdown alternates, llms.txt, GEO frontmatter, JSON-LD, sitemaps).

The two skills together implement the full Mostrador framework. Use them as a pair when building a new content site from scratch.

## What this skill is NOT

❌ **Not a guide to making AI write better prose**. The agent's content quality depends on the agent's model + your prompts. This skill is about the _workflow_, not the _prose_.

❌ **Not a CMS replacement for everyone**. If you have non-technical authors who hate git, give them Keystatic / Tina (which still write to git underneath, but show them a friendly UI).

❌ **Not for sites with frequent content changes by multiple humans**. Git merge conflicts on markdown are painful. Use a database CMS for those.

❌ **Not relevant for AcademIA today**. AcademIA's content (courses, news, articles) lives in Postgres, not in git files. This skill is documented here as a reference for future projects (Mostrador-style blogs, knowledge bases, content sites) where the architecture fits.
