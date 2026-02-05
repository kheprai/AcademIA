import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";

interface MockupSectionProps {
  variant: "value-proposition" | "testimonials" | "cta-final";
}

export function MockupSection({ variant }: MockupSectionProps) {
  switch (variant) {
    case "value-proposition":
      return <ValuePropositionSection />;
    case "testimonials":
      return <TestimonialsSection />;
    case "cta-final":
      return <CtaFinalSection />;
    default:
      return null;
  }
}

function ValuePropositionSection() {
  const { t } = useTranslation();

  const stats = [
    {
      number: "500+",
      label: t("landing.categoryPage.stats.students"),
      description: t("landing.categoryPage.stats.studentsDesc"),
    },
    {
      number: "50+",
      label: t("landing.categoryPage.stats.courses"),
      description: t("landing.categoryPage.stats.coursesDesc"),
    },
    {
      number: "100%",
      label: t("landing.categoryPage.stats.online"),
      description: t("landing.categoryPage.stats.onlineDesc"),
    },
    {
      number: "24/7",
      label: t("landing.categoryPage.stats.support"),
      description: t("landing.categoryPage.stats.supportDesc"),
    },
  ];

  return (
    <section className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-neutral-900">
          {t("landing.categoryPage.stats.title")}
        </h2>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-primary-600 sm:text-5xl">{stat.number}</p>
              <p className="mt-2 text-lg font-semibold text-neutral-900">{stat.label}</p>
              <p className="mt-1 text-sm text-neutral-500">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = [
    {
      key: "student1",
      initials: "MG",
    },
    {
      key: "student2",
      initials: "CL",
    },
    {
      key: "student3",
      initials: "AR",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-neutral-900">
          {t("landing.categoryPage.testimonials.title")}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.key}
              className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">
                    {t(`landing.categoryPage.testimonials.${testimonial.key}.name`)}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {t(`landing.categoryPage.testimonials.${testimonial.key}.role`)}
                  </p>
                </div>
              </div>
              <p className="text-neutral-600 italic">
                &ldquo;{t(`landing.categoryPage.testimonials.${testimonial.key}.quote`)}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaFinalSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t("landing.categoryPage.cta.headline")}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
          {t("landing.categoryPage.cta.subtitle")}
        </p>
        <div className="mt-10">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/courses">{t("landing.categoryPage.cta.button")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
