import { useQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

export const MENU_CATEGORIES_QUERY_KEY = ["menuCategories"];

export const menuCategoriesQueryOptions = () => ({
  queryKey: MENU_CATEGORIES_QUERY_KEY,
  queryFn: async () => {
    const response = await ApiClient.api.categoryControllerGetMenuCategories();
    return response.data;
  },
  select: (
    data: Awaited<ReturnType<typeof ApiClient.api.categoryControllerGetMenuCategories>>["data"],
  ) => data.data,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

export function useMenuCategories() {
  return useQuery(menuCategoriesQueryOptions());
}
