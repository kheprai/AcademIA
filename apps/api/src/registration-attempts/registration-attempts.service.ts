import { Inject, Injectable } from "@nestjs/common";
import { and, count, eq, gte, ilike, lte, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { getSortOptions } from "src/common/helpers/getSortOptions";
import { DEFAULT_PAGE_SIZE } from "src/common/pagination";
import { registrationAttempts } from "src/storage/schema";

import type {
  RegistrationAttemptSortField,
  RegistrationAttemptsQuery,
  RegistrationAttemptsFilterSchema,
} from "./schemas/registration-attempts.schema";

@Injectable()
export class RegistrationAttemptsService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getAll(query: RegistrationAttemptsQuery = {}) {
    const { sort = "createdAt", page = 1, perPage = DEFAULT_PAGE_SIZE, filters = {} } = query;

    const { sortOrder, sortedField } = getSortOptions(sort);
    const conditions = this.getFiltersConditions(filters);

    const data = await this.db
      .select()
      .from(registrationAttempts)
      .where(and(...conditions))
      .orderBy(sortOrder(this.getColumnToSortBy(sortedField as RegistrationAttemptSortField)))
      .limit(perPage)
      .offset((page - 1) * perPage);

    const [{ totalItems }] = await this.db
      .select({ totalItems: count() })
      .from(registrationAttempts)
      .where(and(...conditions));

    return {
      data,
      pagination: {
        totalItems,
        page,
        perPage,
      },
    };
  }

  async getStats(dateFrom?: string, dateTo?: string) {
    const dateConditions = this.getDateConditions(dateFrom, dateTo);

    const [totals, bySource, daily] = await Promise.all([
      this.db
        .select({
          totalAttempts: count(),
          totalRegistered: count(
            sql`CASE WHEN ${registrationAttempts.registered} = true THEN 1 END`,
          ),
        })
        .from(registrationAttempts)
        .where(and(...dateConditions)),

      this.db
        .select({
          source: registrationAttempts.source,
          count: count(),
        })
        .from(registrationAttempts)
        .where(and(...dateConditions))
        .groupBy(registrationAttempts.source),

      this.db
        .select({
          date: sql<string>`date_trunc('day', ${registrationAttempts.createdAt})::date::text`,
          attempts: count(),
          registered: count(sql`CASE WHEN ${registrationAttempts.registered} = true THEN 1 END`),
        })
        .from(registrationAttempts)
        .where(and(...dateConditions))
        .groupBy(sql`date_trunc('day', ${registrationAttempts.createdAt})`)
        .orderBy(sql`date_trunc('day', ${registrationAttempts.createdAt})`),
    ]);

    const { totalAttempts, totalRegistered } = totals[0];
    const conversionRate =
      totalAttempts > 0 ? Math.round((totalRegistered / totalAttempts) * 10000) / 100 : 0;

    return {
      totalAttempts,
      totalRegistered,
      conversionRate,
      bySource,
      daily,
    };
  }

  private getColumnToSortBy(field: RegistrationAttemptSortField) {
    switch (field) {
      case "phone":
        return registrationAttempts.phone;
      case "source":
        return registrationAttempts.source;
      case "registered":
        return registrationAttempts.registered;
      case "createdAt":
      default:
        return registrationAttempts.createdAt;
    }
  }

  private getFiltersConditions(filters: RegistrationAttemptsFilterSchema) {
    const conditions = [];

    if (filters.keyword) {
      conditions.push(ilike(registrationAttempts.phone, `%${filters.keyword}%`));
    }
    if (filters.source) {
      conditions.push(eq(registrationAttempts.source, filters.source));
    }
    if (filters.registered !== undefined) {
      conditions.push(eq(registrationAttempts.registered, filters.registered === "true"));
    }
    if (filters.dateFrom) {
      conditions.push(
        gte(registrationAttempts.createdAt, new Date(filters.dateFrom).toISOString()),
      );
    }
    if (filters.dateTo) {
      const endOfDay = new Date(filters.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      conditions.push(lte(registrationAttempts.createdAt, endOfDay.toISOString()));
    }

    return conditions;
  }

  private getDateConditions(dateFrom?: string, dateTo?: string) {
    const conditions = [];

    if (dateFrom) {
      conditions.push(gte(registrationAttempts.createdAt, new Date(dateFrom).toISOString()));
    }
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      conditions.push(lte(registrationAttempts.createdAt, endOfDay.toISOString()));
    }

    return conditions;
  }
}
