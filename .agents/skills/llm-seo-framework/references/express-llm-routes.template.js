// Reference implementation: Express routes for LLM SEO infrastructure.
//
// This file is a parametrized version of apps/web/server.js lines 42-341 from
// the AcademIA repo. It implements 4 of the 8 elements of the LLM SEO Framework:
//
//   1. /robots.txt    — bot allowlist
//   2. /sitemap.xml   — dynamic XML sitemap
//   4. /llms.txt      — site catalog per llmstxt.org spec
//   + /og-proxy       — image proxy for crawlers
//
// To get to a complete framework implementation, also add the markdown alternate
// routes from references/markdown-alternates.md (Pattern B section).
//
// HOW TO USE:
//   1. Copy this file into your Express server entry point (or import as a module)
//   2. Set the env vars: API_INTERNAL_URL, VITE_APP_URL, COMPANY_NAME
//   3. Adjust the apiFetch endpoints to match your backend's actual API surface
//   4. Mount on your Express app: applyLLMSEORoutes(app, { apiFetch, siteUrl, company })

import express from "express";

/**
 * Mounts LLM-SEO routes on an Express app.
 *
 * @param {express.Express} app
 * @param {Object} options
 * @param {string} options.siteUrl              - Public site URL (e.g. https://academia.tu-dominio.com)
 * @param {string} options.company              - Company display name
 * @param {(path: string) => Promise<any>} options.apiFetch - Backend API client
 * @param {Object} options.endpoints            - Endpoint paths on the backend API
 */
export function applyLLMSEORoutes(app, options) {
  const { siteUrl, company, apiFetch, endpoints } = options;

  // ============================================================
  // 1. /robots.txt
  // ============================================================
  app.get("/robots.txt", async (_req, res) => {
    const robotsTxt = `# ${company} - robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /auth/
Disallow: /settings
Disallow: /profile/
Disallow: /cart
Disallow: /checkout
Disallow: /orders/

# === LLM agents (allowlisted) ===

User-agent: GPTBot
Allow: /
Disallow: /admin/
Disallow: /auth/

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /
Disallow: /admin/
Disallow: /auth/

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /
Disallow: /admin/
Disallow: /auth/

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

# === Standard search engines ===

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-md.xml
`;

    res.set("Content-Type", "text/plain; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(robotsTxt);
  });

  // ============================================================
  // 2. /sitemap.xml
  // ============================================================
  app.get("/sitemap.xml", async (_req, res) => {
    const now = new Date().toISOString().split("T")[0];

    // Adjust these to your backend's API surface
    const [coursesRes, newsRes, articlesRes, categoriesRes] = await Promise.all([
      apiFetch(endpoints.courses),
      apiFetch(endpoints.news),
      apiFetch(endpoints.articles),
      apiFetch(endpoints.categories),
    ]);

    const courses = coursesRes?.data?.items ?? [];
    const news = newsRes?.data?.items ?? [];
    const articles = articlesRes?.data?.items ?? [];
    const categories = categoriesRes?.data ?? [];

    // Static pages — adjust to your actual route map
    const staticPages = [
      { loc: "", priority: "1.0", changefreq: "daily" },
      { loc: "/courses", priority: "0.9", changefreq: "daily" },
      { loc: "/news", priority: "0.8", changefreq: "daily" },
      { loc: "/resources", priority: "0.8", changefreq: "weekly" },
      { loc: "/faq", priority: "0.6", changefreq: "weekly" },
      { loc: "/about", priority: "0.5", changefreq: "monthly" },
      { loc: "/contact", priority: "0.5", changefreq: "monthly" },
    ];

    const urls = [
      ...staticPages.map(
        (page) => `  <url>
    <loc>${siteUrl}${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
      ),
      ...courses.map(
        (course) => `  <url>
    <loc>${siteUrl}/courses/${course.slug}</loc>
    <lastmod>${course.updatedAt?.split("T")[0] ?? now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
      ),
      ...categories
        .filter((cat) => cat.slug)
        .map(
          (cat) => `  <url>
    <loc>${siteUrl}/courses/category/${cat.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
        ),
      ...news.map(
        (item) => `  <url>
    <loc>${siteUrl}/news/${item.slug ?? item.id}</loc>
    <lastmod>${(item.publishedAt ?? item.updatedAt)?.split("T")[0] ?? now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
      ),
      ...articles.map(
        (item) => `  <url>
    <loc>${siteUrl}/resources/${item.slug ?? item.id}</loc>
    <lastmod>${(item.publishedAt ?? item.updatedAt)?.split("T")[0] ?? now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
      ),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(sitemap);
  });

  // ============================================================
  // 2b. /sitemap-md.xml — parallel sitemap with .md alternate URLs
  // ============================================================
  app.get("/sitemap-md.xml", async (_req, res) => {
    const now = new Date().toISOString().split("T")[0];

    const [coursesRes, newsRes, articlesRes] = await Promise.all([
      apiFetch(endpoints.courses),
      apiFetch(endpoints.news),
      apiFetch(endpoints.articles),
    ]);

    const courses = coursesRes?.data?.items ?? [];
    const news = newsRes?.data?.items ?? [];
    const articles = articlesRes?.data?.items ?? [];

    const urls = [
      ...courses.map(
        (c) => `  <url>
    <loc>${siteUrl}/courses/${c.slug}.md</loc>
    <lastmod>${c.updatedAt?.split("T")[0] ?? now}</lastmod>
  </url>`,
      ),
      ...news.map(
        (n) => `  <url>
    <loc>${siteUrl}/news/${n.slug ?? n.id}.md</loc>
    <lastmod>${(n.publishedAt ?? n.updatedAt)?.split("T")[0] ?? now}</lastmod>
  </url>`,
      ),
      ...articles.map(
        (a) => `  <url>
    <loc>${siteUrl}/resources/${a.slug ?? a.id}.md</loc>
    <lastmod>${(a.publishedAt ?? a.updatedAt)?.split("T")[0] ?? now}</lastmod>
  </url>`,
      ),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(sitemap);
  });

  // ============================================================
  // 4. /llms.txt — per llmstxt.org spec
  // ============================================================
  app.get("/llms.txt", async (_req, res) => {
    const [coursesRes, newsRes, articlesRes] = await Promise.all([
      apiFetch(endpoints.courses),
      apiFetch(endpoints.news),
      apiFetch(endpoints.articles),
    ]);

    const courses = coursesRes?.data?.items ?? [];
    const news = newsRes?.data?.items ?? [];
    const articles = articlesRes?.data?.items ?? [];

    // Group courses by category
    const coursesByCategory = new Map();
    for (const course of courses) {
      const cat = course.category || "General";
      const list = coursesByCategory.get(cat) || [];
      list.push(course);
      coursesByCategory.set(cat, list);
    }

    const coursesSections = Array.from(coursesByCategory.entries())
      .map(
        ([category, items]) =>
          `### ${category}\n${items.map((c) => `- [${c.title}](${siteUrl}/courses/${c.slug}.md)`).join("\n")}`,
      )
      .join("\n\n");

    const newsSection = news
      .slice(0, 20)
      .map((n) => `- [${n.title}](${siteUrl}/news/${n.slug ?? n.id}.md)`)
      .join("\n");

    const articlesSection = articles
      .slice(0, 20)
      .map((a) => `- [${a.title}](${siteUrl}/resources/${a.slug ?? a.id}.md)`)
      .join("\n");

    const llmsTxt = `# ${company}

> Plataforma de aprendizaje online especializada en IA práctica para LATAM.

## About

${company} is an online learning platform specializing in practical AI education
for Latin American and US professionals. Content is available in Spanish and English.

## Site Structure

- Homepage: ${siteUrl}/
- All Courses: ${siteUrl}/courses
- News: ${siteUrl}/news
- Resources: ${siteUrl}/resources
- FAQ: ${siteUrl}/faq

## Available Courses

${coursesSections || "No courses currently available."}

## Recent News

${newsSection || "No news currently available."}

## Resources & Articles

${articlesSection || "No articles currently available."}

## Content Access

- All public content is accessible without authentication
- Each content item has a clean Markdown alternate at \`{url}.md\`
- Course details, news, and resources are freely browsable
- Enrollment required only for course lessons (paywalled content)
- Content is available in Spanish (primary) and English

## Technical Details

- Markdown alternates: append \`.md\` to any public URL
- Structured data: JSON-LD on course, news, and resource detail pages
- Sitemap: ${siteUrl}/sitemap.xml
- Sitemap (Markdown alternates): ${siteUrl}/sitemap-md.xml
- Robots: ${siteUrl}/robots.txt
- Posts index: ${siteUrl}/posts-index.md
`;

    res.set("Content-Type", "text/plain; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(llmsTxt);
  });

  // ============================================================
  // /og-proxy — image proxy for crawlers
  // ============================================================
  const ALLOWED_IMAGE_HOSTS = new Set(["localhost", "127.0.0.1", "minio", "s3.amazonaws.com"]);

  app.get("/og-proxy", async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl || typeof imageUrl !== "string") {
      return res.status(400).send("Missing url parameter");
    }

    let parsed;
    try {
      parsed = new URL(imageUrl);
    } catch {
      return res.status(400).send("Invalid url");
    }

    const hostname = parsed.hostname;
    const isAllowed =
      ALLOWED_IMAGE_HOSTS.has(hostname) ||
      hostname.endsWith(".amazonaws.com") ||
      hostname.endsWith(".digitaloceanspaces.com") ||
      hostname.endsWith(".r2.cloudflarestorage.com");

    if (!isAllowed) {
      return res.status(403).send("Host not allowed");
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const upstream = await fetch(imageUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (!upstream.ok) {
        return res.status(upstream.status).send("Upstream error");
      }

      const contentType = upstream.headers.get("content-type") || "image/jpeg";
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=86400");

      const buffer = Buffer.from(await upstream.arrayBuffer());
      res.send(buffer);
    } catch {
      res.status(502).send("Failed to fetch image");
    }
  });
}
