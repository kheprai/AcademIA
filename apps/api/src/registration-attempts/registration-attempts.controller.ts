import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import { baseResponse, BaseResponse, PaginatedResponse, paginatedResponse } from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { USER_ROLES } from "src/user/schemas/userRoles";

import { RegistrationAttemptsService } from "./registration-attempts.service";
import {
  registrationAttemptSchema,
  registrationAttemptsStatsSchema,
  sortRegistrationAttemptFieldsOptions,
  type RegistrationAttemptsFilterSchema,
  type SortRegistrationAttemptFieldsOptions,
  type RegistrationAttemptsStatsResponse,
} from "./schemas/registration-attempts.schema";

@Controller("registration-attempts")
@UseGuards(RolesGuard)
export class RegistrationAttemptsController {
  constructor(private readonly registrationAttemptsService: RegistrationAttemptsService) {}

  @Get()
  @Roles(USER_ROLES.ADMIN)
  @Validate({
    request: [
      { type: "query", name: "keyword", schema: Type.String() },
      { type: "query", name: "source", schema: Type.String() },
      { type: "query", name: "registered", schema: Type.String() },
      { type: "query", name: "dateFrom", schema: Type.String() },
      { type: "query", name: "dateTo", schema: Type.String() },
      { type: "query", name: "page", schema: Type.Number({ minimum: 1 }) },
      { type: "query", name: "perPage", schema: Type.Number() },
      { type: "query", name: "sort", schema: sortRegistrationAttemptFieldsOptions },
    ],
    response: paginatedResponse(Type.Array(registrationAttemptSchema)),
  })
  async getAll(
    @Query("keyword") keyword: string,
    @Query("source") source: string,
    @Query("registered") registered: string,
    @Query("dateFrom") dateFrom: string,
    @Query("dateTo") dateTo: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: SortRegistrationAttemptFieldsOptions,
  ) {
    const filters: RegistrationAttemptsFilterSchema = {
      keyword,
      source,
      registered,
      dateFrom,
      dateTo,
    };

    const result = await this.registrationAttemptsService.getAll({
      filters,
      page,
      perPage,
      sort,
    });

    return new PaginatedResponse(result);
  }

  @Get("stats")
  @Roles(USER_ROLES.ADMIN)
  @Validate({
    request: [
      { type: "query", name: "dateFrom", schema: Type.String() },
      { type: "query", name: "dateTo", schema: Type.String() },
    ],
    response: baseResponse(registrationAttemptsStatsSchema),
  })
  async getStats(
    @Query("dateFrom") dateFrom: string,
    @Query("dateTo") dateTo: string,
  ): Promise<BaseResponse<RegistrationAttemptsStatsResponse>> {
    const stats = await this.registrationAttemptsService.getStats(dateFrom, dateTo);

    return new BaseResponse(stats);
  }
}
