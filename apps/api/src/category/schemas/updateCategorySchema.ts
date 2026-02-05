import { Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

import type { CategoryInsert } from "./createCategorySchema";

export const categoryUpdateSchema = Type.Partial(
  Type.Object({
    id: UUIDSchema,
    title: Type.Record(Type.String(), Type.String()),
    archived: Type.Boolean(),
    slug: Type.String(),
    showInMenu: Type.Boolean(),
    displayOrder: Type.Union([Type.Number(), Type.Null()]),
    heroImageS3Key: Type.Union([Type.String(), Type.Null()]),
    heroTitle: Type.Union([Type.Record(Type.String(), Type.String()), Type.Null()]),
    heroSubtitle: Type.Union([Type.Record(Type.String(), Type.String()), Type.Null()]),
    heroCtaText: Type.Union([Type.Record(Type.String(), Type.String()), Type.Null()]),
    heroCtaUrl: Type.Union([Type.String(), Type.Null()]),
    heroOverlayColor: Type.Union([Type.String(), Type.Null()]),
  }),
);

export type CategoryUpdateBody = Partial<
  Pick<
    CategoryInsert,
    | "title"
    | "archived"
    | "slug"
    | "showInMenu"
    | "displayOrder"
    | "heroImageS3Key"
    | "heroTitle"
    | "heroSubtitle"
    | "heroCtaText"
    | "heroCtaUrl"
    | "heroOverlayColor"
  >
>;
