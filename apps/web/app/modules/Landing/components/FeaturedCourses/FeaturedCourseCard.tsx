import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { CoursePriceDisplay } from "~/components/CoursePriceDisplay/CoursePriceDisplay";

import type { GetAvailableCoursesResponse } from "~/api/generated-api";

type Course = GetAvailableCoursesResponse["data"][number];

interface FeaturedCourseCardProps {
  course: Course;
  language: string;
}

export function FeaturedCourseCard({ course, language: _language }: FeaturedCourseCardProps) {
  const { t } = useTranslation();
  const courseLink = `/courses/${course.slug}`;

  return (
    <Link
      to={courseLink}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.05] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.08]"
    >
      <div className="relative aspect-video overflow-hidden bg-white/[0.03]">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500/10 to-primary-500/5">
            <svg
              className="size-12 text-primary-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}

        {course.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-primary-600 px-3 py-1 text-xs font-medium text-white">
            {t("landing.homepage.featuredCourses.featured")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {course.category && (
          <span className="mb-2 text-xs font-medium uppercase tracking-wider text-primary-600">
            {course.category}
          </span>
        )}
        <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-neutral-900 transition-colors group-hover:text-primary-700">
          {course.title}
        </h3>
        <div className="mt-auto">
          <CoursePriceDisplay
            priceInCents={course.priceInCents}
            mercadopagoPriceInCents={course.mercadopagoPriceInCents}
            stripePriceId={course.stripePriceId}
            mercadopagoProductId={course.mercadopagoProductId}
          />
        </div>
      </div>
    </Link>
  );
}
