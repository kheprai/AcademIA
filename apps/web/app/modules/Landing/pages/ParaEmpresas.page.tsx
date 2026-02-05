import { Link } from "@remix-run/react";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import { buildMeta, getCompanyFromMatches } from "~/utils/meta-helpers";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ matches }) => {
  const company = getCompanyFromMatches(matches);
  return buildMeta({ title: `Servicios | ${company}` });
};

const services = [
  { key: "capacitaciones", href: "/servicios/capacitaciones" },
  { key: "masterclasses", href: "/servicios/masterclasses" },
  { key: "talleres", href: "/servicios/talleres" },
  { key: "charlas", href: "/servicios/charlas" },
  { key: "consultoria", href: "/servicios/consultoria" },
  { key: "implementaciones", href: "/servicios/implementaciones" },
] as const;

export default function ParaEmpresasPage() {
  const { t } = useTranslation();

  return (
    <>
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              {t("landing.servicios.title")}
            </h1>
            <p className="mt-6 text-lg text-neutral-600">{t("landing.servicios.description")}</p>
            <div className="mt-10 flex justify-center">
              <Button asChild>
                <Link to="/contact">{t("landing.servicios.cta")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-100 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.key}
                to={service.href}
                className="group rounded-xl border border-neutral-200 bg-white p-8 transition-shadow hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-neutral-900">
                  {t(`landing.servicios.services.${service.key}.title`)}
                </h3>
                <p className="mt-3 text-sm text-neutral-600">
                  {t(`landing.servicios.services.${service.key}.description`)}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 transition-colors group-hover:text-primary-800">
                  {t("landing.servicios.exploreService")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
