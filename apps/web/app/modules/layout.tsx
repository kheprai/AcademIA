import { type MetaFunction, Outlet } from "@remix-run/react";

import { companyInformationQueryOptions } from "~/api/queries/useCompanyInformation";
import { queryClient } from "~/api/queryClient";
import { serverFetchSafe } from "~/utils/server-fetch.server";

import type { LoaderFunctionArgs } from "@remix-run/node";

export type ParentRouteData = {
  companyInfo: {
    data: {
      companyShortName?: string;
    };
  };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const companyInfo = await serverFetchSafe<ParentRouteData["companyInfo"]>(
    "/api/settings/company-information",
    request,
  );

  return { companyInfo: companyInfo ?? { data: {} } };
};

export const clientLoader = async () => {
  const companyInfo = await queryClient.ensureQueryData(companyInformationQueryOptions);

  return { companyInfo };
};
clientLoader.hydrate = true as const;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const companyShortName = data?.companyInfo?.data?.companyShortName;
  const title = companyShortName ? `${companyShortName}` : "AcademIA";

  return [{ title }];
};

export default function Layout() {
  return <Outlet />;
}
