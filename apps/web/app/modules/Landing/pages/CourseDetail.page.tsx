import { Link, redirect, useParams } from "@remix-run/react";
import { SUPPORTED_LANGUAGES } from "@repo/shared";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  ChevronDown,
  Code,
  FileText,
  Gift,
  HelpCircle,
  Lock,
  Play,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ApiClient } from "~/api/api-client";
import { useCourse, useCurrentUser } from "~/api/queries";
import { useUserDetails } from "~/api/queries/useUserDetails";
import DefaultPhotoCourse from "~/assets/svgs/default-photo-course.svg";
import { CoursePriceDisplay } from "~/components/CoursePriceDisplay/CoursePriceDisplay";
import { JsonLd } from "~/components/JsonLd";
import Viewer from "~/components/RichText/Viever";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { CategoryChip } from "~/components/ui/CategoryChip";
import { Skeleton } from "~/components/ui/skeleton";
import { cn, formatWithPlural } from "~/lib/utils";
import { CourseCardActions } from "~/modules/Cart/CourseCardActions";
import {
  useLanguageStore,
  type Language,
} from "~/modules/Dashboard/Settings/Language/LanguageStore";
import { isSupportedLanguage } from "~/utils/browser-language";
import {
  buildMeta,
  getCompanyFromMatches,
  truncateForMeta,
  ogImageUrl,
} from "~/utils/meta-helpers";
import { serverFetchSafe, resolveLanguage } from "~/utils/server-fetch.server";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { SupportedLanguages } from "@repo/shared";

const languageFlags: Record<Language, { flag: string; label: string; bgColor: string }> = {
  es: { flag: "🇦🇷", label: "Español", bgColor: "bg-sky-100 hover:bg-sky-200" },
  en: { flag: "🇬🇧", label: "English", bgColor: "bg-red-100 hover:bg-red-200" },
};

const resolvePreferredLanguage = (url: URL): SupportedLanguages => {
  const languageFromQuery = url.searchParams.get("language");

  if (languageFromQuery && isSupportedLanguage(languageFromQuery)) {
    return languageFromQuery as SupportedLanguages;
  }

  const storedLanguage = useLanguageStore.getState().language;

  if (storedLanguage && isSupportedLanguage(storedLanguage)) {
    return storedLanguage as SupportedLanguages;
  }

  return SUPPORTED_LANGUAGES.EN;
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const slug = params.slug || "";
  if (!slug) return { course: null };

  const language = resolveLanguage(request);

  const lookup = await serverFetchSafe<{ data: { status: string; slug?: string } }>(
    `/api/course/lookup?id=${encodeURIComponent(slug)}&language=${language}`,
    request,
  );

  if (lookup?.data?.status === "redirect" && lookup.data.slug) {
    const url = new URL(request.url);
    throw new Response(null, {
      status: 302,
      headers: { Location: `/courses/${lookup.data.slug}${url.search}` },
    });
  }

  const courseRes = await serverFetchSafe<{
    data: {
      title: string;
      description: string;
      category: string | null;
      thumbnailUrl?: string;
    };
  }>(`/api/course?id=${encodeURIComponent(slug)}&language=${language}`, request);

  return { course: courseRes?.data ?? null };
};

export const clientLoader = async ({
  params,
  request,
}: {
  params: { slug?: string };
  request: Request;
}) => {
  const idOrSlug = params.slug || "";
  if (!idOrSlug) return { course: null };

  const url = new URL(request.url);
  const language = resolvePreferredLanguage(url);

  const lookupResponse = await ApiClient.api.courseControllerLookupCourse({
    id: idOrSlug,
    language,
  });

  const { status, slug } = lookupResponse.data.data;

  if (status === "redirect" && slug) {
    const redirectUrl = new URL(`/courses/${slug}`, request.url);
    throw redirect(`${redirectUrl.pathname}${redirectUrl.search ?? ""}`, 302);
  }

  return { course: null };
};

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  const company = getCompanyFromMatches(matches);
  const course = data?.course;

  if (!course) {
    return buildMeta({ title: `Curso | ${company}` });
  }

  return buildMeta({
    title: `${course.title} | ${company}`,
    description: truncateForMeta(course.description),
    image: ogImageUrl(course.thumbnailUrl),
    type: "article",
  });
};

function LanguageBadges({
  availableLocales,
  currentLanguage,
  onLanguageChange,
}: {
  availableLocales: Language[];
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {availableLocales.map((locale) => {
        const langInfo = languageFlags[locale];
        if (!langInfo) return null;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => onLanguageChange(locale)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
              langInfo.bgColor,
              locale === currentLanguage
                ? "ring-2 ring-primary-500 ring-offset-1"
                : "opacity-70 hover:opacity-100",
            )}
          >
            <span>{langInfo.flag}</span>
            <span>{langInfo.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const lessonTypeIcons: Record<string, typeof FileText> = {
  content: FileText,
  quiz: HelpCircle,
  ai_mentor: Brain,
  embed: Code,
};

export default function CourseDetailPage() {
  const { t } = useTranslation();
  const { slug = "" } = useParams();

  const { language: webLanguage } = useLanguageStore();

  // Use local state for course language, initialized from ?language= query param or web language
  const [courseLanguage, setCourseLanguage] = useState<SupportedLanguages>(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      return resolvePreferredLanguage(url);
    }
    return webLanguage as SupportedLanguages;
  });

  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());

  const { data: course, isLoading } = useCourse(slug, courseLanguage);
  const { data: currentUser } = useCurrentUser();
  const { data: authorDetails } = useUserDetails(course?.authorId ?? "");

  const isLoggedIn = !!currentUser;

  const authorName = authorDetails
    ? `${authorDetails.firstName ?? ""} ${authorDetails.lastName ?? ""}`.trim() || "Unknown"
    : "Unknown";

  const isEnrolled = course?.enrolled ?? false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isPurchased = (course as any)?.purchased ?? false;

  const handleLanguageChange = (newLang: Language) => {
    setCourseLanguage(newLang as SupportedLanguages);
  };

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  // Auto-fallback: if the course doesn't support the requested language, switch to its base/first available language
  const availableLocales = (course?.availableLocales ?? []) as Language[];
  useEffect(() => {
    if (!course || availableLocales.length === 0) return;
    if (!availableLocales.includes(courseLanguage as Language)) {
      const fallback = (course.baseLanguage as SupportedLanguages) || availableLocales[0];
      setCourseLanguage(fallback as SupportedLanguages);
    }
  }, [course, courseLanguage, availableLocales]);

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (!course) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            {t("landing.courseDetail.notFound")}
          </h1>
          <Button asChild className="mt-6">
            <Link to="/courses">{t("landing.courseDetail.backToCourses")}</Link>
          </Button>
        </div>
      </section>
    );
  }

  const chapterCount = course.chapters?.length ?? 0;
  const hasFreeChapters = course.chapters?.some((ch) => ch.isFreemium) ?? false;
  const isFree = course.priceInCents === 0 && !course.stripePriceId && !course.mercadopagoProductId;

  const renderEnrollmentButton = () => {
    return (
      <CourseCardActions
        course={{
          id: course.id,
          title: course.title,
          slug: slug ?? null,
          thumbnailUrl: course.thumbnailUrl ?? null,
          authorName,
          categoryName: course.category ?? null,
          priceInCents: course.priceInCents,
          mercadopagoPriceInCents: course.mercadopagoPriceInCents ?? 0,
          currency: course.currency,
          stripePriceId: course.stripePriceId ?? null,
          mercadopagoProductId: course.mercadopagoProductId ?? null,
          hasFreeChapters,
        }}
        isEnrolled={isEnrolled}
        isPurchased={isPurchased}
        variant="detail"
      />
    );
  };

  const canAccessLesson = (chapterIsFreemium: boolean) => {
    if (isPurchased) return true;
    if (chapterIsFreemium && isLoggedIn) return true;
    return false;
  };

  const getLessonHint = (chapterIsFreemium: boolean) => {
    if (isPurchased) return null;
    if (chapterIsFreemium && !isLoggedIn) return t("landing.courseDetail.signInToAccess");
    if (!chapterIsFreemium && isEnrolled) return t("landing.courseDetail.purchaseToUnlock");
    if (!chapterIsFreemium) return t("landing.courseDetail.enrollToUnlock");
    return null;
  };

  return (
    <section className="py-12 sm:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: course.title,
          description: course.description || "",
          provider: { "@type": "Organization", name: "AcademIA" },
          ...(course.thumbnailUrl && { image: course.thumbnailUrl }),
          ...(course.category && { about: { "@type": "Thing", name: course.category } }),
        }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="size-4" />
          {t("landing.courseDetail.backToCourses")}
        </Link>

        {/* Hero Section */}
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
          {/* Main Content */}
          <div className="flex flex-col gap-6 min-w-0">
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
              <img
                src={course.thumbnailUrl || DefaultPhotoCourse}
                alt={course.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DefaultPhotoCourse;
                }}
              />
              {isFree && !isPurchased && (
                <Badge variant="successFilled" className="absolute left-4 top-4">
                  {t("landing.courseDetail.freeCourse")}
                </Badge>
              )}
              {!isFree && hasFreeChapters && !isEnrolled && (
                <Badge variant="successFilled" className="absolute left-4 top-4">
                  {t("landing.courseDetail.freeChapters")}
                </Badge>
              )}
              {isEnrolled && !isPurchased && !isFree && (
                <Badge variant="success" className="absolute left-4 top-4">
                  {t("landing.courseDetail.enrolled")}
                </Badge>
              )}
              {isPurchased && (
                <Badge variant="success" className="absolute left-4 top-4">
                  {t("landing.courses.card.enrolled")}
                </Badge>
              )}
            </div>

            {/* Course Info */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryChip category={course.category} />
                {availableLocales.length > 0 && (
                  <LanguageBadges
                    availableLocales={availableLocales}
                    currentLanguage={courseLanguage as Language}
                    onLanguageChange={handleLanguageChange}
                  />
                )}
                <span className="text-sm text-neutral-500">
                  {chapterCount === 1
                    ? t("landing.courses.card.chapter")
                    : t("landing.courses.card.chapters", { count: chapterCount })}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                {course.title}
              </h1>
            </div>

            {/* Description */}
            <div className="mt-4 min-w-0">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                {t("landing.courseDetail.aboutCourse")}
              </h2>
              <Viewer
                content={course.description || ""}
                className="prose prose-neutral max-w-none break-words overflow-x-auto"
                variant="content"
              />
            </div>

            {/* Chapters List — Expandable */}
            {course.chapters && course.chapters.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  {t("landing.courseDetail.courseContent")}
                </h2>
                <p className="text-sm text-neutral-500 mb-4">
                  {t("landing.courseDetail.chaptersCount", { count: chapterCount })}
                </p>
                <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
                  {course.chapters.map((chapter, index) => {
                    const isOpen = openChapters.has(chapter.id);
                    const chapterIsFreemium = !!chapter.isFreemium;
                    const lessons = chapter.lessons ?? [];

                    return (
                      <div
                        key={chapter.id}
                        className={cn(
                          index !== course.chapters!.length - 1 && "border-b border-neutral-200",
                        )}
                      >
                        {/* Chapter header — clickable to expand */}
                        <button
                          type="button"
                          onClick={() => toggleChapter(chapter.id)}
                          className="flex w-full items-center gap-4 p-4 text-left hover:bg-neutral-50 transition-colors"
                        >
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-sm font-medium text-neutral-600">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 truncate">{chapter.title}</p>
                            <p className="text-sm text-neutral-500">
                              {formatWithPlural(
                                chapter.lessonCount,
                                t("courseChapterView.other.lesson"),
                                t("courseChapterView.other.lessons"),
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {chapterIsFreemium ? (
                              <Badge variant="successFilled" className="text-xs">
                                {t("landing.courses.card.free")}
                              </Badge>
                            ) : (
                              !isPurchased && <Lock className="size-4 text-neutral-400" />
                            )}
                            <ChevronDown
                              className={cn(
                                "size-5 text-neutral-400 transition-transform",
                                isOpen && "rotate-180",
                              )}
                            />
                          </div>
                        </button>

                        {/* Expanded lessons */}
                        {isOpen && lessons.length > 0 && (
                          <div className="border-t border-neutral-100 bg-neutral-50/50">
                            {lessons.map((lesson) => {
                              const LessonIcon = lessonTypeIcons[lesson.type] ?? FileText;
                              const accessible = canAccessLesson(chapterIsFreemium);
                              const hint = getLessonHint(chapterIsFreemium);
                              const lessonUrl = `/course/${slug}/lesson/${lesson.id}`;

                              const content = (
                                <div
                                  className={cn(
                                    "flex items-center gap-3 px-4 py-3 pl-[4.5rem]",
                                    accessible
                                      ? "hover:bg-neutral-100 transition-colors"
                                      : "opacity-60",
                                  )}
                                >
                                  <LessonIcon className="size-4 shrink-0 text-neutral-500" />
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={cn(
                                        "text-sm truncate",
                                        accessible ? "text-neutral-800" : "text-neutral-500",
                                      )}
                                    >
                                      {lesson.title}
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                      {t(`landing.courseDetail.lessonTypes.${lesson.type}`)}
                                    </p>
                                  </div>
                                  {accessible ? (
                                    <Play className="size-3.5 text-primary-600 shrink-0" />
                                  ) : hint ? (
                                    <span className="text-xs text-neutral-400 shrink-0 hidden sm:inline">
                                      {hint}
                                    </span>
                                  ) : null}
                                </div>
                              );

                              if (accessible) {
                                return (
                                  <Link key={lesson.id} to={lessonUrl} className="block">
                                    {content}
                                  </Link>
                                );
                              }

                              if (chapterIsFreemium && !isLoggedIn) {
                                return (
                                  <Link
                                    key={lesson.id}
                                    to={`/auth/login?redirect=${encodeURIComponent(`/courses/${slug}`)}`}
                                    className="block"
                                  >
                                    {content}
                                  </Link>
                                );
                              }

                              return <div key={lesson.id}>{content}</div>;
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              {/* Price */}
              <div className="mb-6">
                <CoursePriceDisplay
                  priceInCents={course.priceInCents}
                  mercadopagoPriceInCents={course.mercadopagoPriceInCents}
                  stripePriceId={course.stripePriceId}
                  mercadopagoProductId={course.mercadopagoProductId}
                  variant="detail"
                />
              </div>

              {/* CTA Button */}
              <div className="space-y-3">{renderEnrollmentButton()}</div>

              {/* Course Stats */}
              <div className="mt-6 space-y-3 border-t border-neutral-100 pt-6">
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen className="size-5 text-neutral-400" />
                  <span className="text-neutral-600">
                    {chapterCount === 1
                      ? t("landing.courses.card.chapter")
                      : t("landing.courses.card.chapters", { count: chapterCount })}
                  </span>
                </div>
                {hasFreeChapters && (
                  <div className="flex items-center gap-3 text-sm">
                    <Gift className="size-5 text-success-500" />
                    <span className="text-neutral-600">
                      {t("landing.courseDetail.freeChapters")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseDetailSkeleton() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-5 w-32 mb-8" />
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
          <div className="flex flex-col gap-6">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-10 w-3/4" />
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Skeleton className="h-7 w-48 mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          <div>
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <Skeleton className="h-9 w-24 mb-6" />
              <Skeleton className="h-12 w-full mb-3" />
              <div className="mt-6 space-y-3 border-t border-neutral-100 pt-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
