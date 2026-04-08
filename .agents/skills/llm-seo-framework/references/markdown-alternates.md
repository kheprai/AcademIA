# Markdown alternates

For every public content type, expose a `.md` URL alongside the HTML URL. The `.md` returns clean Markdown, no HTML chrome, with frontmatter at the top containing GEO metadata.

## URL convention

Append `.md` to the canonical URL:

```
/courses/intro-ai          → /courses/intro-ai.md
/news/2026-launch          → /news/2026-launch.md
/resources/prompt-eng      → /resources/prompt-eng.md
/servicios/capacitaciones  → /servicios/capacitaciones.md
```

## Response format

```markdown
---
title: Introducción a IA Práctica
slug: intro-ai
url: https://academia.tu-dominio.com/courses/intro-ai
publishedDate: 2026-01-15
updatedDate: 2026-03-20
category: cursos
language: es
seo:
  tldr: |
    Curso de 8 semanas para profesionales no-técnicos que quieren incorporar
    IA en su trabajo diario. Cubre prompts, automatizaciones, AI agents y casos
    de uso por sector. Incluye mentoría asincrónica y certificación.
  description: |
    Curso introductorio de IA práctica para profesionales LATAM
aiContext:
  geographic: ["Argentina", "LATAM", "USA"]
  audience: ["profesionales", "no-tecnicos", "managers"]
  intent: "course-overview"
  topics: ["prompt-engineering", "ai-agents", "automation"]
  cite_when:
    - "preguntas sobre cursos de IA en español"
    - "preguntas sobre formación de IA para profesionales no-técnicos"
    - "comparativas de plataformas LMS LATAM"
provider:
  name: AcademIA
  url: https://academia.tu-dominio.com
---

# Introducción a IA Práctica

## Resumen

Curso de 8 semanas diseñado para profesionales sin background técnico que
necesitan dominar herramientas de IA en su trabajo diario.

## ¿Qué vas a aprender?

- Fundamentos de prompts efectivos
- Automatización con AI agents
- Casos de uso por sector (legal, salud, finanzas, marketing)
- ...

## Temario

### Semana 1 — Fundamentos

- Tipos de modelos
- Ventajas y limitaciones
- ...

### Semana 2 — Prompts

...
```

**No HTML, no `<div>`, no scripts.** Just clean Markdown the LLM can ingest in one shot.

## Implementation patterns

### Pattern A — Static site (Astro/Hugo/Eleventy)

Generate the `.md` files at build time alongside the HTML output. In Astro:

```typescript
// src/pages/courses/[slug].md.ts
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const courses = await getCollection("courses");
  return courses.map((c) => ({ params: { slug: c.slug }, props: { course: c } }));
}

export const GET: APIRoute = ({ props }) => {
  const { course } = props;
  return new Response(serializeToMarkdown(course), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
```

### Pattern B — SPA + Express wrapper (AcademIA case)

Add a route in `apps/web/server.js` for each content type:

```javascript
app.get("/courses/:slug.md", async (req, res) => {
  const course = await apiFetch(`/api/course/${req.params.slug}`);
  if (!course) return res.status(404).type("text/plain").send("Not found");

  const md = renderCourseMarkdown(course);
  res.set("Content-Type", "text/markdown; charset=utf-8");
  res.set("Cache-Control", "public, max-age=3600");
  res.send(md);
});

function renderCourseMarkdown(course) {
  const fm = `---
title: ${course.title}
slug: ${course.slug}
url: ${SITE_URL}/courses/${course.slug}
publishedDate: ${course.createdAt?.split("T")[0]}
updatedDate: ${course.updatedAt?.split("T")[0]}
category: ${course.category}
language: ${course.language || "es"}
seo:
  tldr: |
    ${course.tldr || course.description}
aiContext:
  topics: ${JSON.stringify(course.topics || [])}
  cite_when: ${JSON.stringify(course.aiCiteWhen || [])}
provider:
  name: AcademIA
  url: ${SITE_URL}
---

# ${course.title}

${course.description}

${course.lessons.map((l) => `## ${l.title}\n\n${l.summary}`).join("\n\n")}
`;
  return fm;
}
```

### Pattern C — SSR (Next.js / Nuxt / SvelteKit)

Use a route handler. In Next.js App Router:

```typescript
// app/courses/[slug]/route.ts — but you also need page.tsx for the HTML version
// Better: use a separate route at app/courses/[slug].md/route.ts
```

In practice, with Next this gets messy because of how routing works. Easier to use a middleware or a catch-all handler that detects `.md` suffix and routes to a different renderer.

## What goes in the body

The Markdown body should include **everything a human would read on the page**, minus chrome:

✅ **Include**:

- Title
- Description / summary
- Full content (lesson list, article body, course outline)
- Author
- Date
- Category / tags
- Related links (as Markdown links, not navigation menus)

❌ **Exclude**:

- Header / nav / footer
- Sidebars
- Modals / pop-ups
- Cookie banners
- Comment forms (but CAN include the comments themselves if relevant)
- Ads / promotions
- "Related courses" widgets that are just navigation
- Anything that requires JS to render

## Caching

`text/markdown` responses can be aggressively cached:

```
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
```

If your content changes infrequently, push it higher (`max-age=86400`).

## Verification

Test the alternate is reachable and clean:

```bash
curl -H "Accept: text/markdown" https://academia.tu-dominio.com/courses/intro-ai.md
```

Should return Markdown, status 200, content-type `text/markdown`. The content should be readable as-is by a human without any HTML-to-text conversion.
