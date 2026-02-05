import { buildMeta, getCompanyFromMatches } from "~/utils/meta-helpers";

import { ServicePage } from "../components/ServicePage";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ matches }) => {
  const company = getCompanyFromMatches(matches);
  return buildMeta({ title: `Consultoría | ${company}` });
};

export default function ConsultoriaPage() {
  return (
    <ServicePage
      sectionKey="consultoria"
      features={[{ key: "diagnostic" }, { key: "roadmap" }, { key: "support" }]}
    />
  );
}
