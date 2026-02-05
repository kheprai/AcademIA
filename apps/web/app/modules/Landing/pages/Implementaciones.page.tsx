import { buildMeta, getCompanyFromMatches } from "~/utils/meta-helpers";

import { ServicePage } from "../components/ServicePage";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ matches }) => {
  const company = getCompanyFromMatches(matches);
  return buildMeta({ title: `Implementaciones | ${company}` });
};

export default function ImplementacionesPage() {
  return (
    <ServicePage
      sectionKey="implementaciones"
      features={[{ key: "integration" }, { key: "development" }, { key: "maintenance" }]}
    />
  );
}
