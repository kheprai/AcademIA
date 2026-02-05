import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import DefaultPhotoCourse from "~/assets/svgs/default-photo-course.svg";
import { CoursePriceDisplay } from "~/components/CoursePriceDisplay/CoursePriceDisplay";
import { Badge } from "~/components/ui/badge";
import { CategoryChip } from "~/components/ui/CategoryChip";
import { cn } from "~/lib/utils";
import { CourseCardActions } from "~/modules/Cart/CourseCardActions";
import { useLanguageStore } from "~/modules/Dashboard/Settings/Language/LanguageStore";

import type { GetAvailableCoursesResponse } from "~/api/generated-api";
import type { Language } from "~/modules/Dashboard/Settings/Language/LanguageStore";

// Extended type with new fields (until API is regenerated)
type CourseWithLocales = GetAvailableCoursesResponse["data"][number] & {
  availableLocales?: string[];
  baseLanguage?: string;
};

const languageFlags: Record<Language, { flag: string; label: string; bgColor: string }> = {
  es: { flag: "🇦🇷", label: "ES", bgColor: "bg-sky-100" },
  en: { flag: "🇬🇧", label: "EN", bgColor: "bg-red-100" },
};

export type PublicCourseCardProps = {
  course: CourseWithLocales;
  isEnrolled: boolean;
  isPurchased: boolean;
  isLoggedIn: boolean;
  displayLanguage?: string;
};

export function PublicCourseCard({
  course,
  isEnrolled,
  isPurchased,
  displayLanguage,
}: PublicCourseCardProps) {
  const { t } = useTranslation();
  const { language: webLanguage } = useLanguageStore();

  // Build course link with ?language= param when displaying in a different language
  const courseLink =
    displayLanguage && displayLanguage !== webLanguage
      ? `/courses/${course.slug}?language=${displayLanguage}`
      : `/courses/${course.slug}`;

  const {
    author,
    availableLocales,
    category,
    courseChapterCount,
    description,
    hasFreeChapters,
    priceInCents,
    mercadopagoPriceInCents,
    stripePriceId,
    mercadopagoProductId,
    slug,
    thumbnailUrl,
    title,
  } = course;

  const isFreeCourse = priceInCents === 0 && !stripePriceId && !mercadopagoProductId;

  const chapterCountText =
    courseChapterCount === 1
      ? t("landing.courses.card.chapter")
      : t("landing.courses.card.chapters", { count: courseChapterCount });

  return (
    <div
      className={cn(
        "group flex h-full w-full flex-col overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-lg",
        {
          "border-secondary-200 hover:border-secondary-500": isPurchased,
          "border-primary-200 hover:border-primary-400": isEnrolled && !isPurchased,
          "border-neutral-200 hover:border-primary-500": !isEnrolled,
        },
      )}
    >
      {/* Thumbnail - clickable */}
      <Link to={courseLink} className="block">
        <div className="relative aspect-video overflow-hidden bg-neutral-100">
          <img
            src={thumbnailUrl || DefaultPhotoCourse}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DefaultPhotoCourse;
            }}
          />
          {/* Top badges: Category and status */}
          <div className="absolute left-3 right-3 top-3 flex flex-col gap-y-1.5">
            <CategoryChip category={category} />
            {isFreeCourse && !isPurchased && (
              <Badge variant="successFilled" className="w-fit">
                {t("landing.courseDetail.freeCourse")}
              </Badge>
            )}
            {hasFreeChapters && !isFreeCourse && !isEnrolled && (
              <Badge variant="successFilled" className="w-fit">
                {t("landing.courses.card.freeLessons")}
              </Badge>
            )}
            {isEnrolled && !isPurchased && !isFreeCourse && (
              <Badge variant="success" className="w-fit">
                {t("landing.courseDetail.enrolled")}
              </Badge>
            )}
            {isPurchased && (
              <Badge variant="success" className="w-fit">
                {t("landing.courses.card.enrolled")}
              </Badge>
            )}
          </div>
          {/* Bottom badges: Chapter count + Language flags */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700 shadow-sm">
              {chapterCountText}
            </span>
            {availableLocales && availableLocales.length > 0 && (
              <div className="flex items-center gap-1">
                {availableLocales.map((locale) => {
                  const langInfo = languageFlags[locale as Language];
                  if (!langInfo) return null;
                  return (
                    <span
                      key={locale}
                      className={cn(
                        "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-700 shadow-sm",
                        langInfo.bgColor,
                      )}
                    >
                      <span className="text-sm">{langInfo.flag}</span>
                      {langInfo.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <Link to={courseLink}>
          <h3 className="font-semibold text-neutral-900 line-clamp-2 hover:underline">{title}</h3>
        </Link>
        <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
          <span dangerouslySetInnerHTML={{ __html: description }} />
        </p>

        {/* Price + Buttons — glued together at the bottom */}
        <div className="mt-auto pt-3">
          {/* Price */}
          <div className="mb-3">
            <CoursePriceDisplay
              priceInCents={priceInCents}
              mercadopagoPriceInCents={mercadopagoPriceInCents}
              stripePriceId={stripePriceId}
              mercadopagoProductId={mercadopagoProductId}
            />
          </div>

          <CourseCardActions
            course={{
              id: course.id ?? "",
              slug,
              title,
              thumbnailUrl,
              authorName: author,
              categoryName: category,
              priceInCents,
              mercadopagoPriceInCents,
              currency: course.currency ?? "USD",
              stripePriceId,
              mercadopagoProductId,
              hasFreeChapters: hasFreeChapters ?? false,
            }}
            isEnrolled={isEnrolled}
            isPurchased={isPurchased}
            variant="card"
          />
        </div>
      </div>

      {/* Card footer — Ver detalles */}
      <div className="flex items-center justify-end border-t border-neutral-100 px-4 py-2">
        <Link
          to={courseLink}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          {t("landing.courses.card.viewDetails")} →
        </Link>
      </div>
    </div>
  );
}
