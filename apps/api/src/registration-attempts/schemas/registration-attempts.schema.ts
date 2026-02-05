import { Type, type Static } from "@sinclair/typebox";

export const registrationAttemptSortFields = [
  "createdAt",
  "phone",
  "source",
  "registered",
] as const;

export type RegistrationAttemptSortField = (typeof registrationAttemptSortFields)[number];

export const sortRegistrationAttemptFieldsOptions = Type.Union([
  ...registrationAttemptSortFields.map((field) => Type.Literal(field)),
  ...registrationAttemptSortFields.map((field) => Type.Literal(`-${field}`)),
]);

export type SortRegistrationAttemptFieldsOptions = Static<
  typeof sortRegistrationAttemptFieldsOptions
>;

export const registrationAttemptsFilterSchema = Type.Object({
  keyword: Type.Optional(Type.String()),
  source: Type.Optional(Type.String()),
  registered: Type.Optional(Type.String()),
  dateFrom: Type.Optional(Type.String()),
  dateTo: Type.Optional(Type.String()),
});

export type RegistrationAttemptsFilterSchema = Static<typeof registrationAttemptsFilterSchema>;

export type RegistrationAttemptsQuery = {
  filters?: RegistrationAttemptsFilterSchema;
  page?: number;
  perPage?: number;
  sort?: SortRegistrationAttemptFieldsOptions;
};

export const registrationAttemptSchema = Type.Object({
  id: Type.String(),
  phone: Type.String(),
  source: Type.String(),
  cartSnapshot: Type.Optional(Type.Any()),
  termsAccepted: Type.Boolean(),
  registered: Type.Boolean(),
  registeredAt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  userId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  firstName: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  lastName: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  totalPriceUsdCents: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  totalPriceArsCents: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export type RegistrationAttemptResponse = Static<typeof registrationAttemptSchema>;

export const registrationAttemptsStatsSchema = Type.Object({
  totalAttempts: Type.Number(),
  totalRegistered: Type.Number(),
  conversionRate: Type.Number(),
  bySource: Type.Array(
    Type.Object({
      source: Type.String(),
      count: Type.Number(),
    }),
  ),
  daily: Type.Array(
    Type.Object({
      date: Type.String(),
      attempts: Type.Number(),
      registered: Type.Number(),
    }),
  ),
});

export type RegistrationAttemptsStatsResponse = Static<typeof registrationAttemptsStatsSchema>;
