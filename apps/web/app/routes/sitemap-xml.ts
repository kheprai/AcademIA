import { serverFetchSafe } from "~/utils/server-fetch.server";

interface CourseItem {
  slug: string;
  title: string;
  updatedAt?: string;
}

interface NewsItem {
  id: string;
  title: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface ArticleItem {
  id: string;
  title: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface CategoryItem {
  slug: string;
  title: string | object;
}

export const loader = async () => {
  const siteUrl = process.env.VITE_APP_URL || "https://app.lms.localhost";
  const now = new Date().toISOString().split("T")[0];

  // Fetch dynamic content in parallel
  const [coursesRes, newsRes, articlesRes, categoriesRes] = await Promise.all([
    serverFetchSafe<{ data: { items: CourseItem[] } }>(
      "/api/course/available-courses?perPage=1000",
    ),
    serverFetchSafe<{ data: { items: NewsItem[] } }>("/api/news?perPage=1000&isPublic=true"),
    serverFetchSafe<{ data: { items: ArticleItem[] } }>("/api/articles/toc?language=es"),
    serverFetchSafe<{ data: CategoryItem[] }>("/api/category"),
  ]);

  const courses = coursesRes?.data?.items ?? [];
  const news = newsRes?.data?.items ?? [];
  const articles = articlesRes?.data?.items ?? [];
  const categories = categoriesRes?.data ?? [];

  // Static pages
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
    // Static pages
    ...staticPages.map(
      (page) => `  <url>
    <loc>${siteUrl}${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
    ),
    // Courses
    ...courses.map(
      (course) => `  <url>
    <loc>${siteUrl}/courses/${course.slug}</loc>
    <lastmod>${course.updatedAt?.split("T")[0] ?? now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    ),
    // Categories
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
    // News
    ...news.map(
      (item) => `  <url>
    <loc>${siteUrl}/news/${item.id}</loc>
    <lastmod>${(item.publishedAt ?? item.updatedAt)?.split("T")[0] ?? now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    ),
    // Resources/Articles
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

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
