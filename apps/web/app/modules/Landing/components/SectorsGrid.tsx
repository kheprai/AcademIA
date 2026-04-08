import { Link } from "@remix-run/react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { fadeUp, scrollRevealProps, staggerContainer } from "~/hooks/useScrollReveal";

const sectors = [
  { key: "health", emoji: "🏥", color: "from-emerald-500/10 to-emerald-500/5" },
  { key: "legal", emoji: "⚖️", color: "from-primary-500/10 to-primary-500/5" },
  { key: "finance", emoji: "📊", color: "from-amber-500/10 to-amber-500/5" },
  { key: "tech", emoji: "💻", color: "from-violet-500/10 to-violet-500/5" },
  { key: "education", emoji: "📚", color: "from-secondary-500/10 to-secondary-500/5" },
  { key: "marketing", emoji: "📢", color: "from-pink-500/10 to-pink-500/5" },
  { key: "government", emoji: "🏛️", color: "from-slate-500/10 to-slate-500/5" },
  { key: "architecture", emoji: "🏗️", color: "from-orange-500/10 to-orange-500/5" },
];

export function SectorsGrid() {
  const { t } = useTranslation();

  return (
    <section className="relative z-10 py-20 sm:py-24">
      <motion.div
        {...scrollRevealProps}
        variants={staggerContainer}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeUp} className="mb-14 text-center">
          <h2 className="font-gothic text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {t("landing.homepage.sectors.title")}
          </h2>
          <p className="mt-4 text-lg text-neutral-600">{t("landing.homepage.sectors.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {sectors.map((sector) => (
            <motion.div key={sector.key} variants={fadeUp}>
              <Link
                to="/courses"
                className={`group flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-gradient-to-br ${sector.color} p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12]`}
              >
                <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                  {sector.emoji}
                </span>
                <span className="text-sm font-semibold text-neutral-900">
                  {t(`landing.homepage.sectors.items.${sector.key}`)}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
