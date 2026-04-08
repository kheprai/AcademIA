import { Link } from "@remix-run/react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useAvailableCourses } from "~/api/queries/useAvailableCourses";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { fadeUp, scrollRevealProps, staggerContainer } from "~/hooks/useScrollReveal";

import { FeaturedCourseCard } from "./FeaturedCourseCard";

import type { SupportedLanguages } from "@repo/shared";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function FeaturedCoursesSection() {
  const { t, i18n } = useTranslation();
  const language = i18n.language as SupportedLanguages;

  const { data: courses } = useAvailableCourses({ language });

  const featuredCourses = useMemo(() => {
    if (!courses) return [];
    const featured = courses.filter((c) => c.isFeatured);
    return shuffleArray(featured.length > 0 ? featured : courses.slice(0, 6));
  }, [courses]);

  if (!featuredCourses.length) return null;

  return (
    <section className="relative z-10 py-20 sm:py-24">
      <motion.div
        {...scrollRevealProps}
        variants={staggerContainer}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeUp} className="mb-12 text-center">
          <h2 className="font-gothic text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {t("landing.homepage.featuredCourses.title")}
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            {t("landing.homepage.featuredCourses.subtitle")}
          </p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Carousel
            opts={{
              align: "start",
              loop: featuredCourses.length > 3,
            }}
            className="mx-auto w-full"
          >
            <CarouselContent className="-ml-4">
              {featuredCourses.map((course) => (
                <CarouselItem key={course.id} className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3">
                  <FeaturedCourseCard course={course} language={language} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex items-center justify-center gap-4">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/courses">{t("landing.homepage.featuredCourses.viewAll")}</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
