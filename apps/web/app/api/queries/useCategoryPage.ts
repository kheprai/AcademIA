import { useQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

export const categoryPageQueryOptions = (slug: string) => ({
  queryKey: ["categoryPage", slug],
  queryFn: async () => {
    const response = await ApiClient.api.categoryControllerGetCategoryPage(slug);
    return response.data;
  },
  select: (
    data: Awaited<ReturnType<typeof ApiClient.api.categoryControllerGetCategoryPage>>["data"],
  ) => data.data,
  enabled: !!slug,
});

export function useCategoryPage(slug: string) {
  return useQuery(categoryPageQueryOptions(slug));
}
