# Auto-discovery tags

These tags go in the global `<head>` (root layout) of every page. They tell LLM crawlers two things:

1. There's a clean Markdown alternate of this page available at a specific URL.
2. The site overall offers structured data + Markdown formats — they don't need to probe.

## The 3 tags

```html
<link
  rel="alternate"
  type="text/markdown"
  href="https://academia.tu-dominio.com/courses/intro-ai.md"
  title="LLM-friendly version"
/>
<meta name="ai-content-available" content="markdown, structured-data" />
<meta name="ai-markdown-url" content="https://academia.tu-dominio.com/courses/intro-ai.md" />
```

## Critical: `text/markdown`, NOT `text/plain`

The original AcademIA implementation (Feb 4 2026) used `type="text/plain"` pointing to `/llms.txt`. **This is wrong** for per-page discovery. The correct pattern from the framework is:

- `type="text/markdown"` — explicitly tells the crawler the alternate is structured Markdown, not plain text
- `href` points to the **per-page** Markdown alternate (the `.md` twin of THIS specific page), not to the site-level `llms.txt`
- The site-level `llms.txt` is a separate concern (catalog), not the alternate of the current page

If you're on a page that doesn't have a per-page alternate (e.g. listing pages, search results), **omit these tags entirely** rather than pointing them at `llms.txt`.

## How to compute the `.md` URL per page

The pattern is simple: append `.md` to the canonical URL of the page. Examples:

| HTML URL                         | Markdown alternate           |
| -------------------------------- | ---------------------------- |
| `/courses/intro-ai`              | `/courses/intro-ai.md`       |
| `/news/2026-launch`              | `/news/2026-launch.md`       |
| `/resources/prompt-eng`          | `/resources/prompt-eng.md`   |
| `/` (homepage)                   | `/index.md` or omit          |
| `/courses` (listing)             | omit                         |
| `/cart`, `/checkout`, `/profile` | omit (private/transactional) |

In a Remix root layout this becomes a function that derives the URL from `useLocation()` and adds `.md`:

```typescript
import { useLocation } from "@remix-run/react";

function MarkdownAlternateTags({ siteUrl }: { siteUrl: string }) {
  const location = useLocation();
  const path = location.pathname;

  // Skip listing/transactional/auth pages
  const skip = ["/", "/courses", "/news", "/resources", "/auth", "/cart", "/checkout", "/profile"];
  if (skip.some((p) => path === p || path.startsWith(`${p}/`) && p !== "/courses" && p !== "/news" && p !== "/resources")) {
    return null;
  }

  const mdUrl = `${siteUrl}${path}.md`;

  return (
    <>
      <link rel="alternate" type="text/markdown" href={mdUrl} title="LLM-friendly version" />
      <meta name="ai-content-available" content="markdown, structured-data" />
      <meta name="ai-markdown-url" content={mdUrl} />
    </>
  );
}
```

## Site-level vs page-level signals

The framework uses **two** different discovery layers, don't confuse them:

| Signal                                        | Where                      | Audience                                          | Purpose                                                           |
| --------------------------------------------- | -------------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| `<link rel="alternate" type="text/markdown">` | every HTML page's `<head>` | LLM agent that just landed on a specific page     | "the clean version of THIS page is at $URL.md"                    |
| `/llms.txt` at site root                      | site-level                 | LLM agent discovering the site for the first time | "here's the catalog of everything we have, organized by category" |
| `/posts-index.md` at site root                | site-level                 | LLM agent that wants to browse before fetching    | "here's a navigable index of all posts with 1-line tldrs"         |
| `/sitemap.xml` + `/sitemap-md.xml`            | site-level                 | All crawlers                                      | "here are all the URLs and when they last changed"                |

A well-implemented site has **all four**.
