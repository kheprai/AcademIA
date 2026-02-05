import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import {
  baseResponse,
  BaseResponse,
  paginatedResponse,
  PaginatedResponse,
  UUIDSchema,
  type UUIDType,
} from "src/common";
import { Public } from "src/common/decorators/public.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CurrentUser as CurrentUserType } from "src/common/types/current-user.type";
import { USER_ROLES, UserRole } from "src/user/schemas/userRoles";

import { CategoryService } from "./category.service";
import {
  type AllCategoriesResponse,
  type CategorySchema,
  type MenuCategorySchema,
  type PublicCategoryPageSchema,
  categorySchema,
  menuCategorySchema,
  publicCategoryPageSchema,
} from "./schemas/category.schema";
import { type SortCategoryFieldsOptions, sortCategoryFieldsOptions } from "./schemas/categoryQuery";
import { categoryCreateSchema, type CategoryInsert } from "./schemas/createCategorySchema";
import { type CategoryUpdateBody, categoryUpdateSchema } from "./schemas/updateCategorySchema";

@UseGuards(RolesGuard)
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Public()
  @Validate({
    response: paginatedResponse(Type.Array(categorySchema)),
    request: [
      { type: "query", name: "title", schema: Type.String() },
      { type: "query", name: "archived", schema: Type.String() },
      { type: "query", name: "page", schema: Type.Number({ minimum: 1 }) },
      { type: "query", name: "perPage", schema: Type.Number() },
      { type: "query", name: "sort", schema: sortCategoryFieldsOptions },
    ],
  })
  async getAllCategories(
    @Query("title") title: string,
    @Query("archived") archived: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: SortCategoryFieldsOptions,
    @CurrentUser("role") currentUserRole?: UserRole,
  ): Promise<PaginatedResponse<AllCategoriesResponse>> {
    const filters = { archived, title };
    const query = { filters, page, perPage, sort };

    const data = await this.categoryService.getCategories(query, currentUserRole);

    return new PaginatedResponse(data);
  }

  @Get("menu")
  @Public()
  @Validate({
    response: baseResponse(Type.Array(menuCategorySchema)),
  })
  async getMenuCategories(): Promise<BaseResponse<MenuCategorySchema[]>> {
    const data = await this.categoryService.getMenuCategories();

    return new BaseResponse(data);
  }

  @Get("page/:slug")
  @Public()
  @Validate({
    response: baseResponse(publicCategoryPageSchema),
    request: [{ type: "param", name: "slug", schema: Type.String() }],
  })
  async getCategoryPage(
    @Param("slug") slug: string,
  ): Promise<BaseResponse<PublicCategoryPageSchema>> {
    const data = await this.categoryService.getCategoryBySlug(slug);

    return new BaseResponse(data);
  }

  @Get(":id")
  @Roles(USER_ROLES.ADMIN)
  @Validate({
    response: baseResponse(categorySchema),
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
  })
  async getCategoryById(@Param("id") id: UUIDType): Promise<BaseResponse<CategorySchema>> {
    const category = await this.categoryService.getCategoryById(id);

    return new BaseResponse(category);
  }

  @Post()
  @Roles(USER_ROLES.ADMIN)
  @Validate({
    request: [
      {
        type: "body",
        schema: categoryCreateSchema,
      },
    ],
    response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  })
  async createCategory(
    @Body() createCategoryBody: CategoryInsert,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
    const { id } = await this.categoryService.createCategory(createCategoryBody, currentUser);

    return new BaseResponse({ id, message: "Category created" });
  }

  @Patch(":id")
  @Roles(USER_ROLES.ADMIN)
  @Validate({
    response: baseResponse(categorySchema),
    request: [
      { type: "param", name: "id", schema: Type.String() },
      { type: "body", schema: categoryUpdateSchema },
    ],
  })
  async updateCategory(
    @Param("id") id: UUIDType,
    @Body() updateCategoryBody: CategoryUpdateBody,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<BaseResponse<CategorySchema>> {
    if (currentUser.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedException("You don't have permission to update category");
    }

    const category = await this.categoryService.updateCategory(id, updateCategoryBody, currentUser);

    return new BaseResponse(category);
  }

  @Delete("deleteCategory/:id")
  @Roles(USER_ROLES.ADMIN)
  @Validate({
    response: baseResponse(Type.Object({ message: Type.String() })),
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
  })
  async deleteCategory(
    @Param("id") id: UUIDType,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.categoryService.deleteCategory(id, currentUser);

    return new BaseResponse({ message: "Category deleted successfully" });
  }

  @Delete("deleteManyCategories")
  @Roles(USER_ROLES.ADMIN)
  @Validate({
    response: baseResponse(Type.Object({ message: Type.String() })),
    request: [{ type: "body", schema: Type.Array(UUIDSchema) }],
  })
  async deleteManyCategories(
    @Body() deleteCategoriesIds: string[],
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.categoryService.deleteManyCategories(deleteCategoriesIds, currentUser);

    return new BaseResponse({ message: "Categories deleted successfully" });
  }
}
