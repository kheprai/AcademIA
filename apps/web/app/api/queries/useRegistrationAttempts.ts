import { useQuery, useSuspenseQuery, keepPreviousData } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

export type RegistrationAttempt = {
  id: string;
  phone: string;
  source: string;
  cartSnapshot: unknown;
  termsAccepted: boolean;
  registered: boolean;
  registeredAt: string | null;
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  totalPriceUsdCents: number | null;
  totalPriceArsCents: number | null;
  createdAt: string;
  updatedAt: string;
};

type RegistrationAttemptsResponse = {
  data: RegistrationAttempt[];
  pagination: {
    totalItems: number;
    page: number;
    perPage: number;
  };
};

export type RegistrationAttemptsParams = {
  keyword?: string;
  source?: string;
  registered?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  perPage?: number;
  sort?: string;
};

export const registrationAttemptsQueryOptions = (params?: RegistrationAttemptsParams) => ({
  queryKey: ["registration-attempts", params],
  queryFn: async () => {
    const response = await ApiClient.instance.get<RegistrationAttemptsResponse>(
      "/api/registration-attempts",
      {
        params: {
          page: params?.page || 1,
          perPage: params?.perPage || 10,
          ...(params?.keyword && { keyword: params.keyword }),
          ...(params?.source && { source: params.source }),
          ...(params?.registered && { registered: params.registered }),
          ...(params?.dateFrom && { dateFrom: params.dateFrom }),
          ...(params?.dateTo && { dateTo: params.dateTo }),
          ...(params?.sort && { sort: params.sort }),
        },
      },
    );
    return response.data;
  },
  placeholderData: keepPreviousData,
});

export function useRegistrationAttempts(params?: RegistrationAttemptsParams) {
  return useQuery(registrationAttemptsQueryOptions(params));
}

export function useRegistrationAttemptsSuspense(params?: RegistrationAttemptsParams) {
  return useSuspenseQuery(registrationAttemptsQueryOptions(params));
}
