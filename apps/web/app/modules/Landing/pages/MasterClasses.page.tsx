import { buildMeta, getCompanyFromMatches } from "~/utils/meta-helpers";

import { ServicePage } from "../components/ServicePage";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ matches }) => {
  const company = getCompanyFromMatches(matches);
  return buildMeta({ title: `Masterclasses | ${company}` });
};

export default function MasterClassesPage() {
  return (
    <ServicePage
      sectionKey="masterclasses"
      features={[{ key: "experts" }, { key: "interactive" }, { key: "recording" }]}
    />
  );
}
