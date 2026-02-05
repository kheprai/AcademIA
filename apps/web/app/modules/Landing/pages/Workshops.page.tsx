import { buildMeta, getCompanyFromMatches } from "~/utils/meta-helpers";

import { ServicePage } from "../components/ServicePage";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ matches }) => {
  const company = getCompanyFromMatches(matches);
  return buildMeta({ title: `Talleres | ${company}` });
};

export default function TalleresPage() {
  return (
    <ServicePage
      sectionKey="talleres"
      features={[{ key: "handson" }, { key: "small" }, { key: "materials" }]}
    />
  );
}
