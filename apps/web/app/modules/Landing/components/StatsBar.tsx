import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { useCountUp } from "~/hooks/useCountUp";
import { fadeUp, scrollRevealProps, staggerContainer } from "~/hooks/useScrollReveal";

interface StatItemProps {
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
  index: number;
}

function StatItem({ end, prefix = "", suffix = "", label, index }: StatItemProps) {
  const { ref, display } = useCountUp({ end, prefix, suffix });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={index}
      className="flex flex-col items-center gap-1 px-6 py-4"
    >
      <span className="font-gothic text-3xl font-bold text-primary-700 sm:text-4xl">{display}</span>
      <span className="text-sm text-neutral-500">{label}</span>
    </motion.div>
  );
}

export function StatsBar() {
  const { t } = useTranslation();

  const stats = [
    { end: 30, prefix: "+", label: t("landing.homepage.stats.courses") },
    { end: 500, prefix: "+", label: t("landing.homepage.stats.students") },
    { end: 200, prefix: "+", label: t("landing.homepage.stats.hours") },
    { end: 8, prefix: "+", label: t("landing.homepage.stats.categories") },
  ];

  return (
    <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.03]">
      <motion.div
        {...scrollRevealProps}
        variants={staggerContainer}
        className="mx-auto grid max-w-5xl grid-cols-2 divide-neutral-200 sm:grid-cols-4 sm:divide-x"
      >
        {stats.map((stat, i) => (
          <StatItem key={stat.label} {...stat} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
