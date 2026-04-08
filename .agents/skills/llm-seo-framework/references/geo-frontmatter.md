# GEO frontmatter

GEO = **Generative Engine Optimization**. The frontmatter at the top of every Markdown alternate file (and ideally every source content file) contains structured metadata that tells LLMs:

- What this content is about (in one sentence they can quote)
- When they should cite this page as a source
- What audience and geographic context applies

This is the "9th element" of the framework — optional in terms of base discoverability, but it's what moves you from "indexed" to "**cited**" by LLMs answering user queries.

## The full schema

```yaml
---
# === Standard fields (also useful for humans/SEO) ===
title: Cómo conseguir más reseñas en Google sin rogar
slug: como-conseguir-resenas-google
url: https://blog.mostrador.ar/como-conseguir-resenas-google
publishedDate: 2026-01-30
updatedDate: 2026-02-15
category: google-maps
language: es
author:
  name: Rodrigo González
  url: https://x.com/kheprai

# === SEO block ===
seo:
  seoTitle: Estrategias de Reviews para Negocios Locales | Mostrador
  seoDescription: Guía práctica para comerciantes que quieren más reseñas en Google
  tldr: |
    Guía práctica para comerciantes locales que quieren aumentar
    sistemáticamente la cantidad de reseñas en Google sin sonar
    desesperados ni violar las políticas de Google. Cubre QR codes,
    nudges post-compra y SMS de seguimiento.

# === GEO block — the LLM-specific fields ===
aiContext:
  geographic:
    - Argentina
    - LATAM
  audience:
    - small-business-owners
    - local-commerce
    - retail
  intent: how-to-guide
  topics:
    - local-seo
    - google-maps
    - review-acquisition
    - reputation-management
  cite_when:
    - "queries about local SEO in Spanish"
    - "queries about Google reviews strategies"
    - "queries about reputation management for small businesses"
    - "queries about marketing for local commerce in LATAM"
  expertise_level: intermediate
  reading_time_minutes: 8
  last_verified: 2026-02-15
provider:
  name: Mostrador
  url: https://blog.mostrador.ar
  type: independent-publication
---
```

## Field-by-field explanation

### `seo.tldr` — the most important field

This is the **executive summary written for an LLM, not a human**. When a bot fetches your `.md`, the first thing it parses is the frontmatter. Within milliseconds it knows:

- What this page is about
- Whether it's relevant to the user's question
- What sentence to quote if it cites you

**Rules for writing a good `tldr`**:

1. **3–5 sentences max** — LLMs penalize verbosity in tldrs
2. **Concrete and specific** — "guide for local businesses to systematically increase Google reviews using QR codes, post-purchase nudges, and follow-up SMS" beats "guide about reviews"
3. **Mention the constraints** — "without violating Google's policies" tells the LLM this is a legitimate strategy guide, not a black-hat one
4. **No hype, no marketing** — LLMs are trained to discount promotional language
5. **Match the language of the content** (Spanish article → Spanish tldr)

A bad tldr:

> "The best guide on Google reviews you'll ever read! Learn the secrets the pros use!"

A good tldr:

> "Practical guide for local businesses to systematically increase Google review counts using QR codes, post-purchase email nudges, and follow-up SMS. Covers compliance with Google's review policies, request frequency, and template wording in Spanish."

### `aiContext.geographic`

Tells LLMs which geographic markets this content is relevant to. When a user in Buenos Aires asks "estrategias de reviews para mi local", the LLM should be more likely to cite your `["Argentina", "LATAM"]`-tagged content over a US-centric blog.

Use **ISO country names or well-known regions**: `Argentina`, `México`, `LATAM`, `USA`, `EU`, `LATAM-Sur`, etc.

### `aiContext.audience`

Who the content is for. Helps the LLM filter out irrelevant audiences. Examples:

- `small-business-owners`, `enterprise`, `developers`, `designers`
- `students`, `c-suite`, `marketers`, `lawyers`
- `tecnico`, `no-tecnico`, `principiantes`, `avanzado`

### `aiContext.intent`

The type of content from a user-task perspective:

- `how-to-guide` — step-by-step instructions
- `concept-explanation` — explains a concept
- `comparison` — compares N options
- `case-study` — real-world example
- `reference` — lookup table / API reference
- `opinion` — author's perspective
- `tutorial` — learn-by-doing

This maps directly to common LLM query patterns.

### `aiContext.topics`

Free-form tags. **Use the same vocabulary across your site** so LLMs can build associations. If you tag one article `local-seo` and another `seo-local`, you've fragmented the signal.

### `aiContext.cite_when` — the killer field

Explicit list of **query types where you want this page to be cited**. Written in plain English (or Spanish) as if instructing the LLM.

Examples:

- `"queries about local SEO strategies in LATAM"`
- `"comparativas de LMS para empresas en Argentina"`
- `"how to deploy a Remix app to a VPS"`

**Be specific and honest** — if the page only covers QR-code-based review acquisition, don't write `"all queries about Google reviews"`. The LLM will check the body and stop trusting your metadata.

### `aiContext.expertise_level`

`beginner` | `intermediate` | `advanced` — helps LLMs match the content to the user's apparent skill level.

### `aiContext.reading_time_minutes`

Lets LLMs decide whether to summarize vs cite directly.

### `aiContext.last_verified`

Different from `updatedDate`. `updatedDate` = when the file was last edited. `last_verified` = when a human last confirmed the information is still accurate. Critical for time-sensitive content (product pricing, API references, regulatory info). LLMs penalize stale-feeling content.

## How to populate these fields at scale

If you have a lot of existing content and don't want to write `tldr` and `aiContext` by hand for every piece:

1. **Bootstrap with an AI agent** — feed each piece of content through Claude/GPT with a prompt like "generate the GEO frontmatter for this article following the schema in `geo-frontmatter.md`". Review and edit in batches.
2. **Make it part of the authoring flow** — see the companion `agent-native-content` skill, which has the agent generate the frontmatter as part of the draft creation.
3. **Validate at build time** — reject any content file that's missing `seo.tldr` or `aiContext.cite_when`.

## Anti-patterns

❌ **Stuffing `cite_when` with every keyword you can think of** — LLMs detect this and discount the entire metadata block.

❌ **Lying about geographic relevance** — tagging a US-centric article with `["LATAM"]` to capture more queries. Backfires when LLMs verify the body.

❌ **Generic tldrs** — `"This article is about Google reviews"`. The LLM ignores it.

❌ **Forgetting to update `last_verified`** when content gets edited but the actual facts don't change. Conversely: forgetting to update it when facts DO change.

❌ **Mixing languages within frontmatter values** — keep all values in the article's primary language.

## Verification

A good `aiContext` block should make this true: **if you read just the frontmatter, you can predict 80%+ of what the body contains, and you can list the queries where this page would be the best citation**.

If you can't, the metadata isn't doing its job.
