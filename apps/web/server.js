import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use("/assets", express.static("build/client/assets", { immutable: true, maxAge: "1y" }));
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// SEO routes — served directly by Express (SPA mode can't use Remix loaders)
const API_INTERNAL_URL = process.env.API_INTERNAL_URL || "http://localhost:3000";

async function apiFetch(path) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_INTERNAL_URL}${path}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

app.get("/robots.txt", async (_req, res) => {
  const companyRes = await apiFetch("/api/settings/company-information");
  const siteUrl = process.env.VITE_APP_URL || "https://app.lms.localhost";
  const company = companyRes?.data?.companyShortName || "AcademIA";

  const robotsTxt = `# ${company} - robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /auth/
Disallow: /settings
Disallow: /progress
Disallow: /library
Disallow: /course/
Disallow: /qa/
Disallow: /articles/
Disallow: /profile/
Disallow: /cart
Disallow: /checkout
Disallow: /orders/

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

User-agent: PerplexityBot
Allow: /
Disallow: /admin/
Disallow: /auth/

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  res.set("Content-Type", "text/plain");
  res.set("Cache-Control", "public, max-age=3600");
  res.send(robotsTxt);
});

app.get("/sitemap.xml", async (_req, res) => {
  const siteUrl = process.env.VITE_APP_URL || "https://app.lms.localhost";
  const now = new Date().toISOString().split("T")[0];

  const [coursesRes, newsRes, articlesRes, categoriesRes] = await Promise.all([
    apiFetch("/api/course/available-courses?perPage=1000"),
    apiFetch("/api/news?perPage=1000&isPublic=true"),
    apiFetch("/api/articles/toc?language=es"),
    apiFetch("/api/category"),
  ]);

  const courses = coursesRes?.data?.items ?? [];
  const news = newsRes?.data?.items ?? [];
  const articles = articlesRes?.data?.items ?? [];
  const categories = categoriesRes?.data ?? [];

  const staticPages = [
    { loc: "", priority: "1.0", changefreq: "daily" },
    { loc: "/courses", priority: "0.9", changefreq: "daily" },
    { loc: "/news", priority: "0.8", changefreq: "daily" },
    { loc: "/resources", priority: "0.8", changefreq: "weekly" },
    { loc: "/faq", priority: "0.6", changefreq: "weekly" },
    { loc: "/about", priority: "0.5", changefreq: "monthly" },
    { loc: "/contact", priority: "0.5", changefreq: "monthly" },
    { loc: "/tools", priority: "0.6", changefreq: "weekly" },
    { loc: "/servicios", priority: "0.7", changefreq: "monthly" },
    { loc: "/servicios/capacitaciones", priority: "0.6", changefreq: "monthly" },
    { loc: "/servicios/masterclasses", priority: "0.6", changefreq: "monthly" },
    { loc: "/servicios/talleres", priority: "0.6", changefreq: "monthly" },
    { loc: "/servicios/charlas", priority: "0.6", changefreq: "monthly" },
    { loc: "/servicios/consultoria", priority: "0.6", changefreq: "monthly" },
    { loc: "/servicios/implementaciones", priority: "0.6", changefreq: "monthly" },
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
    <loc>${siteUrl}/news/${item.id}</loc>
    <lastmod>${(item.publishedAt ?? item.updatedAt)?.split("T")[0] ?? now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    ),
    ...articles.map(
      (item) => `  <url>
    <loc>${siteUrl}/resources/${item.id}</loc>
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

app.get("/llms.txt", async (_req, res) => {
  const siteUrl = process.env.VITE_APP_URL || "https://app.lms.localhost";

  const [companyRes, coursesRes, newsRes, articlesRes] = await Promise.all([
    apiFetch("/api/settings/company-information"),
    apiFetch("/api/course/available-courses?perPage=100"),
    apiFetch("/api/news?perPage=20&isPublic=true"),
    apiFetch("/api/articles/toc?language=es"),
  ]);

  const company = companyRes?.data?.companyShortName || "AcademIA";
  const courses = coursesRes?.data?.items ?? [];
  const news = newsRes?.data?.items ?? [];
  const articles = articlesRes?.data?.items ?? [];

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
        `### ${category}\n${items.map((c) => `- [${c.title}](${siteUrl}/courses/${c.slug})`).join("\n")}`,
    )
    .join("\n\n");

  const newsSection = news
    .slice(0, 20)
    .map((n) => `- [${n.title}](${siteUrl}/news/${n.id})`)
    .join("\n");

  const articlesSection = articles
    .slice(0, 20)
    .map((a) => `- [${a.title}](${siteUrl}/resources/${a.id})`)
    .join("\n");

  const llmsTxt = `# ${company}

> Plataforma de aprendizaje online con cursos, mentores y certificaciones.

## About

${company} is an online learning platform that provides courses, mentoring, and certifications.
Content is available in Spanish and English.

## Site Structure

- Homepage: ${siteUrl}/
- All Courses: ${siteUrl}/courses
- News: ${siteUrl}/news
- Resources: ${siteUrl}/resources
- FAQ: ${siteUrl}/faq
- Services: ${siteUrl}/servicios
- Contact: ${siteUrl}/contact

## Available Courses

${coursesSections || "No courses currently available."}

## Recent News

${newsSection || "No news currently available."}

## Resources & Articles

${articlesSection || "No articles currently available."}

## Content Access

- All public content is accessible without authentication
- Course details, news, and resources are freely browsable
- Enrollment is required to access course lessons
- Content is available in Spanish (primary) and English

## Technical Details

- Content-Type: text/html (standard pages)
- Structured data: JSON-LD on course, news, and resource pages
- Sitemap: ${siteUrl}/sitemap.xml
- Robots: ${siteUrl}/robots.txt
`;

  res.set("Content-Type", "text/plain; charset=utf-8");
  res.set("Cache-Control", "public, max-age=3600");
  res.send(llmsTxt);
});

// OG image proxy — proxies internal S3/MinIO images for social media crawlers
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

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Express server listening at http://localhost:${port}`));
