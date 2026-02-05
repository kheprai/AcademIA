import { serverFetchSafe } from "~/utils/server-fetch.server";

interface CourseItem {
  slug: string;
  title: string;
  category: string | null;
  description?: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary?: string;
}

interface ArticleItem {
  id: string;
  title: string;
  summary?: string;
}

export const loader = async () => {
  const siteUrl = process.env.VITE_APP_URL || "https://app.lms.localhost";

  const [companyRes, coursesRes, newsRes, articlesRes] = await Promise.all([
    serverFetchSafe<{ data: { companyShortName?: string; companyFullName?: string } }>(
      "/api/settings/company-information",
    ),
    serverFetchSafe<{ data: { items: CourseItem[] } }>("/api/course/available-courses?perPage=100"),
    serverFetchSafe<{ data: { items: NewsItem[] } }>("/api/news?perPage=20&isPublic=true"),
    serverFetchSafe<{ data: { items: ArticleItem[] } }>("/api/articles/toc?language=es"),
  ]);

  const company = companyRes?.data?.companyShortName || "AcademIA";
  const courses = coursesRes?.data?.items ?? [];
  const news = newsRes?.data?.items ?? [];
  const articles = articlesRes?.data?.items ?? [];

  const coursesByCategory = new Map<string, CourseItem[]>();
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

  return new Response(llmsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
