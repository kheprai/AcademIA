import { buildMeta, getCompanyFromMatches } from "~/utils/meta-helpers";

import { ServicePage } from "../components/ServicePage";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ matches }) => {
  const company = getCompanyFromMatches(matches);
  return buildMeta({ title: `Capacitaciones | ${company}` });
};

export default function CapacitacionesPage() {
  return (
    <ServicePage
      sectionKey="capacitaciones"
      features={[{ key: "custom" }, { key: "practice" }, { key: "certification" }]}
    />
  );
}
