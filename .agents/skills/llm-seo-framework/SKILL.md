---
name: llm-seo-framework
description: "Build AI-discoverable websites following the 'Third Audience' philosophy: serve content in dual formats (HTML for humans, Markdown/structured data for LLM agents like ChatGPT, Claude, Perplexity). Includes auto-discovery tags, llms.txt/sitemap/robots.txt with bot allowlist, JSON-LD Schema.org structured data, GEO (Generative Engine Optimization) frontmatter, and markdown alternates. Use when building or upgrading a public-facing site (blog, LMS, product page) that needs to be cited as a source by AI chat systems."
---

# LLM SEO Framework

## Origin

This skill is the operational distillation of the **"Agent-Native" content framework** designed by Rodrigo González (Kheprai) for `blog.mostrador.ar`. The full original article ships with this skill at `references/SEO-LLM-Framework-original.md` and is the source of truth for the philosophy. Read it before applying.

The philosophy itself ("The Third Audience") originated with **Dries Buytaert** (creator of Drupal) — the framework operationalizes Dries' concept into a concrete, reusable implementation pattern.

## When to use

Use this skill when:

- Building or upgrading a **public-facing website** (blog, LMS, course catalog, product/marketing site, news site) that needs to be cited as a source by ChatGPT, Claude, Perplexity, Gemini, and other LLMs.
- The site already targets humans + search engines and you want to add the **third audience** (AI agents).
- You want LLMs to be able to consume your content **without parsing HTML, navigating menus, dodging modals, or executing JavaScript**.
- You want to maximize the chances that LLMs **cite your domain as an authority** when answering user queries in your topic area.

Do **not** use this skill for:

- Internal apps or private dashboards (LLM crawlers can't reach them anyway).
- Sites where the content lives entirely behind auth.
- Pure SPAs where the marketing surface is a single landing page with no real content (nothing for the LLM to ingest).

## The Third Audience philosophy

Traditional web optimization targets two audiences:

1. **Humans** — need visual design, legibility, accessibility, working JS.
2. **Search engines** — need meta tags, sitemaps, structured HTML, page speed.

The **third audience** is **LLM agents** (Claude, ChatGPT, Perplexity, Gemini, …). They want:

- **Pure data**, structured and clean.
- **No HTML chrome** (headers, footers, modals, sidebars, navigation).
- **No JavaScript execution** required.
- **Discoverability without crawling** — they want to know your content exists and where to fetch the clean version, in one HTTP round-trip.

The framework serves the **same content in two formats in parallel**: HTML for humans/search engines, and a clean Markdown alternate for LLM agents, with explicit auto-discovery so the agent knows the alternate exists.

## The 8 elements of the framework

A site is "Agent-Native compliant" when it has all 8:

| #   | Element                                          | Purpose                                                                                                                                                          |
| --- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **`/robots.txt` with bot allowlist**             | Explicitly allow `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Googlebot`, `Bingbot` (and others) to public content; deny them on auth/admin/checkout |
| 2   | **`/sitemap.xml` (dynamic)**                     | Standard sitemap for Googlebot/Bingbot, regenerated from live data                                                                                               |
| 3   | **`/sitemap-md.xml`**                            | Parallel sitemap listing the `.md` alternate URLs of every public content item                                                                                   |
| 4   | **`/llms.txt`**                                  | Site-level catalog per the [llmstxt.org](https://llmstxt.org) spec — describes the site, lists key URLs, organizes content by category                           |
| 5   | **`/posts-index.md`**                            | Per-content-section index in clean Markdown — lets agents browse and pick what to fetch                                                                          |
| 6   | **Markdown alternates**                          | Every public HTML page (`/courses/intro-ai`) has a Markdown twin (`/courses/intro-ai.md`) returning clean content with frontmatter, no HTML chrome               |
| 7   | **Auto-discovery tags** in every HTML `<head>`   | Tells the LLM "there is a Markdown alternate of this page, here's the URL"                                                                                       |
| 8   | **JSON-LD structured data** in every detail page | Schema.org types embedded in `<script type="application/ld+json">` so LLMs can extract semantic facts without parsing prose                                      |

Plus an optional 9th element (more advanced):

| 9 | **GEO frontmatter** in every Markdown alternate | Generative Engine Optimization fields (`seo.tldr`, `aiContext`) that tell the LLM how to summarize and when to cite this content |

## Quickstart: how to apply this to a project

This is the playbook. Each step links to a reference file with full templates.

### Step 1 — Inventory

Before writing code, audit the project:

- What is the **runtime architecture**? Static (Astro/Hugo/Eleventy)? SPA (Remix/Next SPA mode)? SSR (Next/Nuxt/SvelteKit)? Hybrid?
- Where does content come from? Files in `/content` (markdown-based)? Database via API? Headless CMS?
- What's the **public surface area**? Which URL patterns need to be discoverable?
- What's the **deployment target**? Vercel? VPS + Caddy? Edge?

The implementation differs by architecture:

| Architecture                       | Where to put the LLM endpoints                                                                                                                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Static (Astro/Hugo/Eleventy)**   | Generate `.md` files at build time alongside the HTML; serve robots/sitemap/llms.txt as build artifacts                                                                                              |
| **SPA (Remix SPA mode, Next SPA)** | Add an Express/Fastify wrapper (`server.js`) and define the LLM routes there. **You cannot use SPA loaders for these — they need server execution.** See `references/express-llm-routes.template.js` |
| **SSR (Next/Nuxt/SvelteKit)**      | Use API routes / route handlers for `robots.txt`, `sitemap.xml`, `llms.txt`, and the `.md` alternates                                                                                                |

### Step 2 — Implement the 4 server routes (the always-required base)

For SPA/SSR architectures, the minimum viable LLM-friendly setup is these 4 endpoints. The reference implementation lives at `references/express-llm-routes.template.js` and is **lifted directly from `apps/web/server.js` lines 42–341 of the AcademIA repo**, parametrized for reuse.

1. **`GET /robots.txt`** — dynamic, with the bot allowlist. See `references/robots-txt-template.md`.
2. **`GET /sitemap.xml`** — dynamic from live data (DB or API), with `lastmod`/`changefreq`/`priority`. See `references/sitemap-template.md`.
3. **`GET /llms.txt`** — site catalog per llmstxt.org spec. See `references/llms-txt-template.md`.
4. **`GET /og-proxy?url=...`** _(if assets are on internal storage)_ — proxy for internal images so social media + LLM crawlers can resolve them. See `references/og-proxy-template.md`.

### Step 3 — Add JSON-LD to every detail page

Every page that represents a single piece of content (course, article, news item, FAQ, product) gets a JSON-LD `<script>` block in `<head>` with the appropriate Schema.org type. See `references/jsonld-schemas.md` for the 5 types and full templates: `Course`, `Article`, `NewsArticle`, `Organization`, `FAQPage`.

**Listing pages** (course list, news index) generally do not need JSON-LD — they need basic meta tags + a link to the relevant entries in `llms.txt` and `posts-index.md`.

### Step 4 — Add auto-discovery tags to every page

In the global `<head>` (e.g. `root.tsx`, `_app.tsx`, base layout):

```html
<link rel="alternate" type="text/markdown" href="/this-page.md" title="LLM-friendly version" />
<meta name="ai-content-available" content="markdown" />
<meta name="ai-markdown-url" content="/this-page.md" />
```

Critical: `type="text/markdown"`, NOT `type="text/plain"`. See `references/auto-discovery-tags.md` for the full pattern, including how to compute the per-page `.md` URL.

### Step 5 — Implement Markdown alternates

For each public content type, expose a `.md` URL that returns the clean Markdown version:

- `/courses/intro-ai` → `/courses/intro-ai.md`
- `/news/how-llms-work` → `/news/how-llms-work.md`
- `/resources/prompt-engineering` → `/resources/prompt-engineering.md`

The `.md` response is **plain Markdown**, no HTML, no scripts, with **frontmatter at the top** containing the GEO fields. See `references/markdown-alternates.md`.

### Step 6 — Add GEO frontmatter

Every Markdown alternate ships with frontmatter containing:

```yaml
---
title: How to get more Google reviews (without begging)
slug: how-to-get-google-reviews
publishedDate: 2026-01-30
category: google-maps
seo:
  tldr: |
    Practical guide for local businesses to systematically increase their
    Google review count using QR codes, post-purchase nudges, and follow-up
    SMS — without violating Google's policies or sounding desperate.
aiContext:
  geographic: ["Argentina", "LATAM"]
  audience: ["small-business-owners", "local-commerce"]
  intent: "how-to-guide"
  cite_when: ["queries about local SEO", "queries about review acquisition"]
---
```

The `seo.tldr` is the **executive summary for LLMs** — when an agent reads the file, it understands the central point in milliseconds. The `aiContext` block tells LLMs **when to cite this page** (geographic/topical relevance). See `references/geo-frontmatter.md` for the full schema and rationale.

### Step 7 — Generate `posts-index.md`

A single Markdown file at `/posts-index.md` listing every piece of content, organized by category, with title + URL + tldr (1-line). This is what an agent fetches **first** when it discovers the site, before deciding which `.md` to read in full. See `references/posts-index-template.md`.

### Step 8 — Add the parallel `.md` sitemap

`/sitemap-md.xml` mirrors `/sitemap.xml` but with the `.md` URLs. Crawlers that respect sitemaps will discover all the alternates automatically.

## Common pitfalls (the SSR ghosts)

When implementing this on a SPA/SSR codebase, these 4 bugs **will** appear. They're documented in detail in `references/ssr-pitfalls.md` because they took hours to debug the first time around.

1. **`getComputedStyle is not defined` on SSR** — happens when a `useState` initializer reads browser-only APIs. Fix: empty initial state + `useEffect` with `typeof document` guard.
2. **Vite build error on `routes/sitemap[.]xml.ts`** — bracket syntax in filenames doesn't resolve. Use `routes/sitemap-xml.ts` instead.
3. **Hydration mismatch in detail pages** — `clientLoader` returns `null` while the server loader returns `{course: {...}}`, so the `meta` function generates different HTML on each side. Fix: make `clientLoader` return the same shape (`{course: null}`).
4. **Hydration mismatch in JSON-LD `Organization`** — `meta` function uses `typeof window !== "undefined"` to access `window.location.origin`. Server gets empty string, client gets the URL → DOM mismatch on the JSON-LD `<script>`. Fix: drop the `window`-dependent field entirely from the JSON-LD, or hardcode `siteUrl` from env.

## Bot allowlist reference

The current curated list of LLM crawlers to allow on `robots.txt` (April 2026):

| Bot                  | Owner         | Notes                                         |
| -------------------- | ------------- | --------------------------------------------- |
| `GPTBot`             | OpenAI        | Primary indexing crawler for ChatGPT          |
| `ChatGPT-User`       | OpenAI        | Used when ChatGPT browses on behalf of a user |
| `ClaudeBot`          | Anthropic     | Claude's training/indexing crawler            |
| `Claude-Web`         | Anthropic     | User-driven browsing                          |
| `PerplexityBot`      | Perplexity AI | Indexing                                      |
| `Perplexity-User`    | Perplexity AI | User-driven browsing                          |
| `Google-Extended`    | Google        | Opt-in for Bard/Gemini training               |
| `Googlebot`          | Google        | Standard search                               |
| `Bingbot`            | Microsoft     | Standard search + Copilot                     |
| `Applebot`           | Apple         | Spotlight + Apple Intelligence                |
| `Amazonbot`          | Amazon        | Alexa                                         |
| `cohere-ai`          | Cohere        | Indexing                                      |
| `Meta-ExternalAgent` | Meta          | Llama training                                |

Re-verify this list periodically: <https://darkvisitors.com/agents>.

## Reference implementation

This skill ships with a working reference implementation **already in production** at `apps/web/server.js` lines 42–341 of the AcademIA repo. It implements elements 1, 2, 4, plus the OG image proxy. Elements 3, 5, 6, 7, 9 are documented in this skill but **not yet shipped in AcademIA** — they are listed as upgrade tasks in `references/academia-upgrade-tasks.md`.

## Companion skill

This skill is paired with **`agent-native-content`**, which describes how to set up the **content authoring side** — letting an AI agent operate git as a software engineer (draft branches, frontmatter validation, hybrid review cycle, auto-deploy on merge). The two skills together implement the full Mostrador framework. Use them as a pair when building a new site from scratch.
