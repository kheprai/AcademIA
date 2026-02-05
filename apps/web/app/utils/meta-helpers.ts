import type { MetaDescriptor } from "@remix-run/node";

export function truncateForMeta(text: string | undefined | null, maxLength = 160): string {
  if (!text) return "";
  // Strip HTML tags
  const clean = text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength - 3) + "...";
}

type ParentMatchData = { companyInfo?: { data?: { companyShortName?: string } } } | undefined;

export function getCompanyFromMatches(matches: { id: string; data: unknown }[]): string {
  const parentData = matches.find((m) => m.id === "routes/modules/layout")?.data as ParentMatchData;
  return parentData?.companyInfo?.data?.companyShortName || "AcademIA";
}

export function ogImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl) return "/og-image.png";
  return `/og-proxy?url=${encodeURIComponent(imageUrl)}`;
}

/**
 * Build a standardized set of 10 meta tags for every route.
 * Keeping the count and keys consistent prevents React from inserting/removing
 * <head> children across navigations, which avoids hydration crashes.
 */
export function buildMeta(opts: {
  title: string;
  description?: string;
  image?: string;
  type?: string;
}): MetaDescriptor[] {
  return [
    { title: opts.title },
    { name: "description", content: opts.description || "" },
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description || "" },
    { property: "og:image", content: opts.image || "/og-image.png" },
    { property: "og:type", content: opts.type || "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description || "" },
    { name: "twitter:image", content: opts.image || "/og-image.png" },
  ];
}
