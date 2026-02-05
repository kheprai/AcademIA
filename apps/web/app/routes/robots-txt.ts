import { serverFetchSafe } from "~/utils/server-fetch.server";

export const loader = async () => {
  const companyInfo = await serverFetchSafe<{ data: { companyShortName?: string } }>(
    "/api/settings/company-information",
  );
  const siteUrl = process.env.VITE_APP_URL || "https://app.lms.localhost";

  const robotsTxt = `# ${companyInfo?.data?.companyShortName || "AcademIA"} - robots.txt
# Optimized for search engines and AI agents

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

# AI Crawlers - Welcome
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

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
