import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";

interface Feature {
  key: string;
}

interface ServicePageProps {
  sectionKey: string;
  features: Feature[];
}

export function ServicePage({ sectionKey, features }: ServicePageProps) {
  const { t } = useTranslation();

  return (
    <>
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-700">
              {t(`landing.${sectionKey}.subtitle`)}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              {t(`landing.${sectionKey}.title`)}
            </h1>
            <p className="mt-6 text-lg text-neutral-600">
              {t(`landing.${sectionKey}.description`)}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-100 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.key} className="rounded-xl border border-neutral-200 bg-white p-8">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {t(`landing.${sectionKey}.features.${feature.key}.title`)}
                </h3>
                <p className="mt-3 text-sm text-neutral-600">
                  {t(`landing.${sectionKey}.features.${feature.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-neutral-900">{t("landing.servicios.title")}</h2>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild>
                <Link to="/contact">{t("landing.servicios.cta")}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/servicios">{t("landing.nav.serviciosAll")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
