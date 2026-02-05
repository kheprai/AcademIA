import { useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { useAvailableCourses } from "~/api/queries/useAvailableCourses";
import { useCategoryPage } from "~/api/queries/useCategoryPage";
import { useLanguageStore } from "~/modules/Dashboard/Settings/Language/LanguageStore";
import { buildMeta, getCompanyFromMatches, ogImageUrl } from "~/utils/meta-helpers";
import { serverFetchSafe } from "~/utils/server-fetch.server";

import { CategoryHero } from "../components/CategoryHero";
import { CategoryNavigationButtons } from "../components/CategoryNavigationButtons";
import { FeaturedCourseShowcase } from "../components/FeaturedCourseShowcase";
import { MockupSection } from "../components/MockupSection";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const slug = params.slug || "";
  if (!slug) return { category: null };

  const categoryRes = await serverFetchSafe<{
    data: {
      heroTitle: Record<string, string> | null;
      heroSubtitle: Record<string, string> | null;
      heroImageUrl: string | null;
    };
  }>(`/api/category/page/${encodeURIComponent(slug)}`, request);

  return { category: categoryRes?.data ?? null };
};

// Skip server round-trip on client navigation; React Query handles data on the client
export const clientLoader = () => ({ category: null });

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  const company = getCompanyFromMatches(matches);
  const category = data?.category;

  const lang = "es";
  const heroTitle =
    category?.heroTitle && typeof category.heroTitle === "object"
      ? (category.heroTitle as Record<string, string>)[lang] ||
        Object.values(category.heroTitle)[0] ||
        ""
      : "";

  return buildMeta({
    title: heroTitle ? `${heroTitle} | ${company}` : `Categoría | ${company}`,
    image: ogImageUrl(category?.heroImageUrl),
  });
};

function getCategoryTitle(
  title: string | Record<string, string> | object,
  language: string,
): string {
  if (typeof title === "string") return title;
  const record = title as Record<string, string>;
  return record?.[language] || record?.en || Object.values(record || {})[0] || "";
}

export default function CategoryLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const { data: categoryPage, isLoading: isLoadingCategory } = useCategoryPage(slug ?? "");

  const categoryTitle = categoryPage?.title ? getCategoryTitle(categoryPage.title, language) : "";

  const { data: courses, isLoading: isLoadingCourses } = useAvailableCourses({
    language,
    ...(slug && { category: slug }),
  });

  const isLoading = isLoadingCategory || isLoadingCourses;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-neutral-500">{t("landing.categoryPage.loading")}</p>
        </div>
      </div>
    );
  }

  if (!categoryPage) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900">
            {t("landing.categoryPage.notFound")}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CategoryHero
        heroImageUrl={categoryPage.heroImageUrl}
        heroTitle={categoryPage.heroTitle}
        heroSubtitle={categoryPage.heroSubtitle}
        heroCtaText={categoryPage.heroCtaText}
        heroCtaUrl={categoryPage.heroCtaUrl}
        heroOverlayColor={categoryPage.heroOverlayColor}
        language={language}
      />
      <MockupSection variant="value-proposition" />
      <FeaturedCourseShowcase courses={courses ?? []} language={language} />
      <CategoryNavigationButtons categoryTitle={categoryTitle} categorySlug={slug ?? ""} />
      <MockupSection variant="testimonials" />
      <MockupSection variant="cta-final" />
    </div>
  );
}
