import { JsonLd } from "~/components/JsonLd";
import { buildMeta, getCompanyFromMatches } from "~/utils/meta-helpers";

import { B2BServices } from "../components/B2BServices";
import { CTAFinal } from "../components/CTAFinal";
import { FeaturedCoursesSection } from "../components/FeaturedCourses/FeaturedCoursesSection";
import { HeroSection } from "../components/Hero/HeroSection";
import { SectorsGrid } from "../components/SectorsGrid";
import { StatsBar } from "../components/StatsBar";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { ValueProposition } from "../components/ValueProposition";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ matches }) => {
  const company = getCompanyFromMatches(matches);
  return buildMeta({
    title: company,
    description: `Plataforma de aprendizaje online - ${company}`,
  });
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedCoursesSection />
      <ValueProposition />
      <SectorsGrid />
      <B2BServices />
      <TestimonialsSection />
      <CTAFinal />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AcademIA",
          description: "Plataforma de aprendizaje online",
        }}
      />
    </>
  );
}
