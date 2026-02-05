import { JsonLd } from "~/components/JsonLd";
import { buildMeta, getCompanyFromMatches } from "~/utils/meta-helpers";

import { FeaturesSection } from "../components/FeaturesSection";
import { HeroSection } from "../components/HeroSection";

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
      <FeaturesSection />
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
