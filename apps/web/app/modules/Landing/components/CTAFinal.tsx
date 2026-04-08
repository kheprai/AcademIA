import { Link } from "@remix-run/react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import { fadeUp, scrollRevealProps, staggerContainer } from "~/hooks/useScrollReveal";

export function CTAFinal() {
  const { t } = useTranslation();

  return (
    <section className="relative z-10 overflow-hidden py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_rgba(91,122,255,0.18)_0%,_transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,_rgba(255,107,74,0.10)_0%,_transparent_50%)]"
        aria-hidden="true"
      />

      <motion.div
        {...scrollRevealProps}
        variants={staggerContainer}
        className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
      >
        <motion.h2
          variants={fadeUp}
          className="font-gothic text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl"
        >
          {t("landing.homepage.ctaFinal.title")}
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-neutral-600">
          {t("landing.homepage.ctaFinal.subtitle")}
        </motion.p>
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button size="lg" asChild className="min-w-[200px] text-base">
            <Link to="/auth/register">{t("landing.homepage.ctaFinal.cta")}</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="min-w-[200px] border-white/20 text-base text-neutral-900 hover:bg-white/10"
          >
            <Link to="/courses">{t("landing.homepage.ctaFinal.ctaSecondary")}</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
