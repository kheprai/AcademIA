import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

export type RegistrationAttemptsStats = {
  totalAttempts: number;
  totalRegistered: number;
  conversionRate: number;
  bySource: Array<{
    source: string;
    count: number;
  }>;
  daily: Array<{
    date: string;
    attempts: number;
    registered: number;
  }>;
};

type StatsResponse = {
  data: RegistrationAttemptsStats;
};

export type RegistrationAttemptsStatsParams = {
  dateFrom?: string;
  dateTo?: string;
};

export const registrationAttemptsStatsQueryOptions = (
  params?: RegistrationAttemptsStatsParams,
) => ({
  queryKey: ["registration-attempts-stats", params],
  queryFn: async () => {
    const response = await ApiClient.instance.get<StatsResponse>(
      "/api/registration-attempts/stats",
      {
        params: {
          ...(params?.dateFrom && { dateFrom: params.dateFrom }),
          ...(params?.dateTo && { dateTo: params.dateTo }),
        },
      },
    );
    return response.data;
  },
  placeholderData: keepPreviousData,
  select: (data: StatsResponse) => data.data,
});

export function useRegistrationAttemptsStats(params?: RegistrationAttemptsStatsParams) {
  return useQuery(registrationAttemptsStatsQueryOptions(params));
}
