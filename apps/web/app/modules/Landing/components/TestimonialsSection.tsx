import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { fadeUp, scrollRevealProps, staggerContainer } from "~/hooks/useScrollReveal";

export function TestimonialsSection() {
  const { t } = useTranslation();
  const testimonials = t("landing.homepage.testimonials.items", {
    returnObjects: true,
  }) as Array<{
    quote: string;
    name: string;
    role: string;
    company: string;
  }>;

  return (
    <section className="relative z-10 py-20 sm:py-24">
      <motion.div
        {...scrollRevealProps}
        variants={staggerContainer}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeUp} className="mb-14 text-center">
          <h2 className="font-gothic text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {t("landing.homepage.testimonials.title")}
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            {t("landing.homepage.testimonials.subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.blockquote
              key={i}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 transition-all hover:border-white/[0.12] hover:bg-white/[0.07]"
            >
              <svg
                className="mb-4 size-8 text-primary-500/30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
              </svg>
              <p className="flex-1 text-neutral-700 leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
              <footer className="mt-6 border-t border-white/[0.06] pt-4">
                <p className="font-semibold text-neutral-900">{item.name}</p>
                <p className="text-sm text-neutral-500">
                  {item.role}, {item.company}
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
