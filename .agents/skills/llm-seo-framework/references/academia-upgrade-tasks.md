# AcademIA — pending upgrade tasks to reach 100% framework compliance

The current AcademIA implementation (`apps/web/server.js` lines 42–341, plus the JSON-LD blocks in CourseDetail/NewsDetail/ResourceDetail/FAQ/Home) covers ~50% of the LLM SEO Framework. This file lists the remaining work, prioritized.

## Status snapshot (April 2026)

| Element                             | Status                  | Where it lives                                                         |
| ----------------------------------- | ----------------------- | ---------------------------------------------------------------------- |
| 1. `/robots.txt` with bot allowlist | ✅ Done                 | `apps/web/server.js:61-112`                                            |
| 2. `/sitemap.xml` (dynamic)         | ✅ Done                 | `apps/web/server.js:114-201`                                           |
| 3. `/sitemap-md.xml`                | ❌ TODO                 | —                                                                      |
| 4. `/llms.txt`                      | ✅ Done                 | `apps/web/server.js:203-292`                                           |
| 5. `/posts-index.md`                | ❌ TODO                 | —                                                                      |
| 6. Markdown alternates per page     | ❌ TODO                 | —                                                                      |
| 7. Auto-discovery tags              | ⚠️ Partial — wrong type | `apps/web/app/root.tsx` (uses `text/plain`, should be `text/markdown`) |
| 8. JSON-LD on detail pages          | ✅ Done                 | CourseDetail/NewsDetail/ResourceDetail/FAQ/Home                        |
| 9. GEO frontmatter                  | ❌ TODO                 | —                                                                      |

Plus:

- `/og-proxy` for internal images: ✅ Done

## Tasks (in dependency order)

### Task 1 — DB schema additions

Add fields to the `courses`, `news`, and `articles` tables:

```sql
ALTER TABLE courses ADD COLUMN seo_tldr text;
ALTER TABLE courses ADD COLUMN ai_context jsonb;
ALTER TABLE news ADD COLUMN seo_tldr text;
ALTER TABLE news ADD COLUMN ai_context jsonb;
ALTER TABLE articles ADD COLUMN seo_tldr text;
ALTER TABLE articles ADD COLUMN ai_context jsonb;
```

`ai_context` shape (JSONB):

```json
{
  "geographic": ["Argentina", "LATAM"],
  "audience": ["profesionales", "no-tecnicos"],
  "intent": "course-overview",
  "topics": ["prompt-engineering", "ai-agents"],
  "cite_when": ["queries about AI courses in Spanish"],
  "expertise_level": "beginner"
}
```

Drizzle migration goes in `apps/api/src/storage/migrations/`. Generate with `pnpm run --filter=api db:generate` after editing the schema files.

### Task 2 — Admin UI for GEO fields

In each content admin page (course editor, news editor, article editor), add a collapsible "AI / GEO" section with:

- Textarea for `seo_tldr` (with character counter, max ~500 chars)
- Multi-tag input for `ai_context.geographic` (predefined options: Argentina, LATAM, USA, EU, Global)
- Multi-tag input for `ai_context.audience`
- Select for `ai_context.intent` (how-to-guide, course-overview, comparison, case-study, reference, opinion, tutorial)
- Free-form tag input for `ai_context.topics`
- Textarea for `ai_context.cite_when` (one entry per line)
- Select for `ai_context.expertise_level` (beginner / intermediate / advanced)

For existing content, leave fields nullable. Add a "bootstrap with AI" button that calls the OpenAI/Claude API with the content body and proposes the GEO fields, which the admin can review and save.

### Task 3 — Markdown alternate routes in `server.js`

Add to `apps/web/server.js`:

```javascript
app.get("/courses/:slug.md", async (req, res) => {
  const courseRes = await apiFetch(`/api/course/${req.params.slug}`);
  if (!courseRes?.data) return res.status(404).type("text/plain").send("Not found");
  const md = renderCourseMarkdown(courseRes.data);
  res.set("Content-Type", "text/markdown; charset=utf-8");
  res.set("Cache-Control", "public, max-age=3600");
  res.send(md);
});

app.get("/news/:slug.md", async (req, res) => {
  /* same pattern */
});
app.get("/resources/:slug.md", async (req, res) => {
  /* same pattern */
});
```

The `renderCourseMarkdown` function (and equivalents for news/articles) lives in a new file `apps/web/server-markdown-renderers.js`. Each function:

1. Builds the YAML frontmatter from the content's standard fields + `seo_tldr` + `ai_context`
2. Appends the Markdown body (course → title + description + lesson list; news → title + body; article → title + body)
3. Returns the full string

See `references/markdown-alternates.md` for the rendering template.

### Task 4 — `/posts-index.md` route

```javascript
app.get("/posts-index.md", async (_req, res) => {
  const [coursesRes, newsRes, articlesRes] = await Promise.all([
    apiFetch("/api/course/available-courses?perPage=1000"),
    apiFetch("/api/news?perPage=1000&isPublic=true"),
    apiFetch("/api/articles/toc?language=es"),
  ]);

  const courses = coursesRes?.data?.items ?? [];
  const news = newsRes?.data?.items ?? [];
  const articles = articlesRes?.data?.items ?? [];

  const md = `# AcademIA — Posts Index

> Navigable index of all public content. Each entry has a 1-line tldr.
> For machine-readable site catalog see [llms.txt](/llms.txt).
> Last updated: ${new Date().toISOString().split("T")[0]}

## Cursos

${courses.map((c) => `- **[${c.title}](${SITE_URL}/courses/${c.slug}.md)** — ${c.seoTldr || c.description}`).join("\n")}

## News

${news.map((n) => `- **[${n.title}](${SITE_URL}/news/${n.slug ?? n.id}.md)** — ${n.seoTldr || n.summary}`).join("\n")}

## Resources

${articles.map((a) => `- **[${a.title}](${SITE_URL}/resources/${a.slug ?? a.id}.md)** — ${a.seoTldr || a.summary}`).join("\n")}
`;

  res.set("Content-Type", "text/markdown; charset=utf-8");
  res.set("Cache-Control", "public, max-age=1800");
  res.send(md);
});
```

### Task 5 — `/sitemap-md.xml` route

Already templated in `references/express-llm-routes.template.js`. Lift directly into `apps/web/server.js`.

### Task 6 — Fix auto-discovery tags in `root.tsx`

Current state in `apps/web/app/root.tsx`:

```tsx
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly content index" />
<meta name="ai-content-available" content="structured-data, llms-txt" />
```

Replace with:

```tsx
<MarkdownAlternateTags siteUrl={import.meta.env.VITE_APP_URL} />
```

Where `MarkdownAlternateTags` is the component defined in `references/auto-discovery-tags.md`. It computes the per-page `.md` URL from `useLocation()` and emits the correct `text/markdown` alternate, falling back to nothing on listing/transactional pages.

### Task 7 — Update `/llms.txt` to use `.md` URLs

Current implementation in `server.js:226-231` builds the `llms.txt` with HTML URLs:

```javascript
.map((c) => `- [${c.title}](${siteUrl}/courses/${c.slug})`)
```

Change to point at the `.md` alternates (now that they exist):

```javascript
.map((c) => `- [${c.title}](${siteUrl}/courses/${c.slug}.md)`)
```

This way an LLM that fetches `llms.txt` and follows the links gets clean Markdown directly, no second request.

### Task 8 — Verification

After all of the above, verify with curl:

```bash
# Robots.txt
curl -s https://academia.tu-dominio.com/robots.txt | grep -E "GPTBot|ClaudeBot|PerplexityBot"

# Sitemap with .md URLs
curl -s https://academia.tu-dominio.com/sitemap-md.xml | head -20

# llms.txt
curl -s https://academia.tu-dominio.com/llms.txt | head -50

# Posts index
curl -s https://academia.tu-dominio.com/posts-index.md | head -30

# Markdown alternate (pick a real course slug)
curl -s https://academia.tu-dominio.com/courses/intro-ai.md

# Auto-discovery tag in HTML page
curl -s https://academia.tu-dominio.com/courses/intro-ai | grep "rel=\"alternate\""
```

Each should return content matching the framework spec.

## Dependencies / blockers

- Task 2 (admin UI) **blocks** Task 3 from being useful — without GEO fields populated, the markdown alternates have empty frontmatter
- Tasks 3 + 5 **block** Task 7 (changing llms.txt URLs) — point to non-existent URLs otherwise
- Task 6 **blocks** the auto-discovery from being correct — but is independent of the others (can ship anytime)

Recommended order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8.

## NOT in scope of this task list

- The `agent-native-content` skill (companion skill) — that's the **content authoring** flow, which AcademIA doesn't need yet because content goes through the admin UI, not git
- Migration away from Express to a different SSR framework
- Adding Schema.org types beyond the current 5 (Course, Article, NewsArticle, Organization, FAQPage)
- Internationalization of `llms.txt` / `posts-index.md` — currently Spanish only
