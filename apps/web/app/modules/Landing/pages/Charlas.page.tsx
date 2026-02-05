import { buildMeta, getCompanyFromMatches } from "~/utils/meta-helpers";

import { ServicePage } from "../components/ServicePage";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ matches }) => {
  const company = getCompanyFromMatches(matches);
  return buildMeta({ title: `Charlas | ${company}` });
};

export default function CharlasPage() {
  return (
    <ServicePage
      sectionKey="charlas"
      features={[{ key: "trends" }, { key: "cases" }, { key: "networking" }]}
    />
  );
}
