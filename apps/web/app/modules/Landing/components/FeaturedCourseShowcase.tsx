import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { CoursePriceDisplay } from "~/components/CoursePriceDisplay/CoursePriceDisplay";
import { Button } from "~/components/ui/button";

import type { GetAvailableCoursesResponse } from "~/api/generated-api";

type Course = GetAvailableCoursesResponse["data"][number] & {
  availableLocales?: string[];
};

function getCourseLink(course: Course, language: string): string {
  const basePath = `/courses/${course.slug}`;
  // If the course doesn't have the current web language available, link with the course's base language
  if (course.availableLocales && !course.availableLocales.includes(language)) {
    const fallbackLang = course.availableLocales[0];
    if (fallbackLang) return `${basePath}?language=${fallbackLang}`;
  }
  return basePath;
}

interface FeaturedCourseShowcaseProps {
  courses: Course[];
  language: string;
}

export function FeaturedCourseShowcase({ courses, language }: FeaturedCourseShowcaseProps) {
  const { t } = useTranslation();

  if (!courses || courses.length === 0) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-neutral-500">
              {t("landing.categoryPage.noCoursesAvailable")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const featuredCourse = courses.find((c) => c.isFeatured) || courses[0];
  const popularCourses = courses.filter((c) => c.id !== featuredCourse.id).slice(0, 4);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-3xl font-bold tracking-tight text-neutral-900">
          {t("landing.categoryPage.featuredCourses")}
        </h2>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Featured Course - Large Card */}
          <div className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
            <Link to={getCourseLink(featuredCourse, language)} className="block">
              <div className="relative aspect-video overflow-hidden bg-neutral-100">
                {featuredCourse.thumbnailUrl ? (
                  <img
                    src={featuredCourse.thumbnailUrl}
                    alt={featuredCourse.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                    <svg
                      className="size-16 text-neutral-400"
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
              </div>
            </Link>
            <div className="p-6">
              <Link to={getCourseLink(featuredCourse, language)}>
                <h3 className="text-2xl font-bold text-neutral-900 hover:underline">
                  {featuredCourse.title}
                </h3>
              </Link>
              {featuredCourse.description && (
                <p className="mt-3 text-neutral-600 line-clamp-3">
                  <span dangerouslySetInnerHTML={{ __html: featuredCourse.description }} />
                </p>
              )}
              <div className="mt-6 flex items-center justify-between">
                <CoursePriceDisplay
                  priceInCents={featuredCourse.priceInCents}
                  mercadopagoPriceInCents={featuredCourse.mercadopagoPriceInCents}
                  stripePriceId={featuredCourse.stripePriceId}
                  mercadopagoProductId={featuredCourse.mercadopagoProductId}
                />
                <Button asChild>
                  <Link to={getCourseLink(featuredCourse, language)}>
                    {t("landing.categoryPage.viewCourse")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Popular Courses - Compact Cards */}
          <div className="flex flex-col gap-4">
            {popularCourses.map((course) => (
              <Link
                key={course.id}
                to={getCourseLink(course, language)}
                className="group flex gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                      <svg
                        className="size-8 text-neutral-400"
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
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h4 className="font-semibold text-neutral-900 line-clamp-2 group-hover:underline">
                    {course.title}
                  </h4>
                  <CoursePriceDisplay
                    priceInCents={course.priceInCents}
                    mercadopagoPriceInCents={course.mercadopagoPriceInCents}
                    stripePriceId={course.stripePriceId}
                    mercadopagoProductId={course.mercadopagoProductId}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
