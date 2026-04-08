import { Link } from "@remix-run/react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import { fadeUp, scrollRevealProps, staggerContainer } from "~/hooks/useScrollReveal";

const services = [
  { key: "training", link: "/servicios/capacitaciones" },
  { key: "masterclasses", link: "/servicios/masterclasses" },
  { key: "workshops", link: "/servicios/talleres" },
  { key: "consulting", link: "/servicios/consultoria" },
  { key: "implementations", link: "/servicios/implementaciones" },
  { key: "talks", link: "/servicios/charlas" },
];

export function B2BServices() {
  const { t } = useTranslation();

  return (
    <section className="relative z-10 py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,_rgba(91,122,255,0.08)_0%,_transparent_50%)]"
        aria-hidden="true"
      />
      <motion.div
        {...scrollRevealProps}
        variants={staggerContainer}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div variants={fadeUp}>
            <h2 className="font-gothic text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {t("landing.homepage.b2b.title")}
            </h2>
            <p className="mt-2 text-xl text-primary-600">{t("landing.homepage.b2b.subtitle")}</p>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600">
              {t("landing.homepage.b2b.description")}
            </p>
            <Button size="lg" asChild className="mt-8">
              <Link to="/servicios">{t("landing.homepage.b2b.cta")}</Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.key}
                to={service.link}
                className="group flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.05] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.08]"
              >
                <span className="font-medium text-neutral-800 group-hover:text-primary-700">
                  {t(`landing.homepage.b2b.services.${service.key}`)}
                </span>
                <ArrowRight className="size-4 text-neutral-400 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
