# JSON-LD Schemas — the 5 types AcademIA uses

All blocks go inside the `<head>` of the relevant page as a `<script type="application/ld+json">` tag. In Remix `meta` functions, use the `script:ld+json` shorthand:

```typescript
{
  "script:ld+json": { /* the object */ }
}
```

## 1. `Course` — for course detail pages

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Introducción a IA Práctica",
  "description": "Curso de 8 semanas...",
  "provider": {
    "@type": "Organization",
    "name": "AcademIA"
  },
  "image": "https://academia.tu-dominio.com/og-proxy?url=...",
  "about": {
    "@type": "Thing",
    "name": "Inteligencia Artificial"
  },
  "inLanguage": "es",
  "offers": {
    "@type": "Offer",
    "price": "29",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

**When to use**: any page representing a single course (CourseDetail page, category landing).

## 2. `Article` — for resource/article detail pages

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cómo escribir prompts efectivos",
  "description": "Guía práctica de prompt engineering...",
  "image": "https://academia.tu-dominio.com/og-proxy?url=...",
  "datePublished": "2026-01-15",
  "dateModified": "2026-02-20",
  "author": {
    "@type": "Organization",
    "name": "AcademIA"
  },
  "publisher": {
    "@type": "Organization",
    "name": "AcademIA",
    "logo": {
      "@type": "ImageObject",
      "url": "https://academia.tu-dominio.com/logo.png"
    }
  }
}
```

**When to use**: educational resources, guides, tutorials, blog-style content.

## 3. `NewsArticle` — for news pages

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "AcademIA lanza nueva certificación en IA",
  "description": "...",
  "image": "https://academia.tu-dominio.com/og-proxy?url=...",
  "datePublished": "2026-04-01T10:00:00-03:00",
  "publisher": {
    "@type": "Organization",
    "name": "AcademIA"
  }
}
```

**When to use**: time-sensitive news content. Distinct from `Article` because LLMs and search engines treat news differently (recency matters more).

## 4. `Organization` — for the homepage

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AcademIA",
  "alternateName": "Academia Online de IA",
  "url": "https://academia.tu-dominio.com",
  "logo": "https://academia.tu-dominio.com/logo.png",
  "description": "Plataforma de educación online especializada en IA para LATAM y USA",
  "sameAs": ["https://twitter.com/academia", "https://www.linkedin.com/company/academia"]
}
```

**When to use**: only on the homepage. **Do not** use `window.location.origin` to compute `url` — that causes hydration mismatches in SPA mode. Hardcode it from env or omit the field.

## 5. `FAQPage` — for FAQ pages

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo me inscribo en un curso?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Podés inscribirte directamente desde la página del curso..."
      }
    }
  ]
}
```

**When to use**: FAQ pages with structured Q&A. Render conditionally — only output the JSON-LD when there's actually FAQ data, otherwise omit the entire script block.

## Additional Schema.org types worth considering

These aren't in AcademIA today but should be added when the relevant content type appears:

- **`BreadcrumbList`** — on every detail page, helps LLMs understand site hierarchy
- **`Person`** — for author/instructor profiles
- **`VideoObject`** — for course video lessons
- **`HowTo`** — for step-by-step tutorials (very LLM-friendly)
- **`Product`** — if courses are sold as products with reviews
- **`Review`** / **`AggregateRating`** — student testimonials with ratings

## Audit checklist

For every detail page, verify:

- [ ] JSON-LD is in the page's `<head>`, not in `<body>`
- [ ] Required Schema.org fields for the type are populated (use https://validator.schema.org)
- [ ] No `window.location.*` or other browser-only APIs in the values
- [ ] Image URLs go through `/og-proxy` if they point to internal storage
- [ ] The `@context` is exactly `https://schema.org`
- [ ] No trailing `null` or `undefined` values (omit the field instead)
