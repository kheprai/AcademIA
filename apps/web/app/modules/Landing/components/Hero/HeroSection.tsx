import { Link } from "@remix-run/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";

export function HeroSection() {
  const { t } = useTranslation();
  const headlines = t("landing.homepage.hero.headlines", { returnObjects: true }) as string[];
  const [headlineIndex, setHeadlineIndex] = useState(0);

  const rotateHeadline = useCallback(() => {
    setHeadlineIndex((prev) => (prev + 1) % headlines.length);
  }, [headlines.length]);

  useEffect(() => {
    const interval = setInterval(rotateHeadline, 4000);
    return () => clearInterval(interval);
  }, [rotateHeadline]);

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,_rgba(91,122,255,0.20)_0%,_transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="relative mb-6 h-[4.5rem] sm:h-[5.5rem] lg:h-[6.5rem]">
          <AnimatePresence mode="wait">
            <motion.h1
              key={headlineIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-x-0 font-gothic text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
            >
              {headlines[headlineIndex]}
            </motion.h1>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-600 sm:text-xl"
        >
          {t("landing.homepage.hero.subheadline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button size="lg" asChild className="min-w-[200px] text-base">
            <Link to="/courses">{t("landing.homepage.hero.ctaCourses")}</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="min-w-[200px] border-white/20 text-base text-neutral-900 hover:bg-white/10"
          >
            <Link to="/servicios">{t("landing.homepage.hero.ctaServices")}</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500"
        >
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-primary-400" />
            {t("landing.homepage.hero.trustBadges.students")}
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-secondary-400" />
            {t("landing.homepage.hero.trustBadges.bilingual")}
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-success-400" />
            {t("landing.homepage.hero.trustBadges.aiMentors")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
