import { Type, type Static } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

export const categorySchema = Type.Object({
  id: UUIDSchema,
  title: Type.Union([Type.String(), Type.Record(Type.String(), Type.String())]),
  archived: Type.Union([Type.Boolean(), Type.Null()]),
  createdAt: Type.Union([Type.String(), Type.Null()]),
  slug: Type.String(),
  showInMenu: Type.Optional(Type.Boolean()),
  displayOrder: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  heroImageS3Key: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  heroImageUrl: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  heroTitle: Type.Optional(Type.Union([Type.Record(Type.String(), Type.String()), Type.Null()])),
  heroSubtitle: Type.Optional(Type.Union([Type.Record(Type.String(), Type.String()), Type.Null()])),
  heroCtaText: Type.Optional(Type.Union([Type.Record(Type.String(), Type.String()), Type.Null()])),
  heroCtaUrl: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  heroOverlayColor: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

export const menuCategorySchema = Type.Object({
  id: UUIDSchema,
  title: Type.Union([Type.String(), Type.Record(Type.String(), Type.String())]),
  slug: Type.String(),
  displayOrder: Type.Union([Type.Number(), Type.Null()]),
});

export const publicCategoryPageSchema = Type.Object({
  id: UUIDSchema,
  title: Type.Union([Type.String(), Type.Record(Type.String(), Type.String())]),
  slug: Type.String(),
  heroImageUrl: Type.Union([Type.String(), Type.Null()]),
  heroTitle: Type.Union([Type.Record(Type.String(), Type.String()), Type.Null()]),
  heroSubtitle: Type.Union([Type.Record(Type.String(), Type.String()), Type.Null()]),
  heroCtaText: Type.Union([Type.Record(Type.String(), Type.String()), Type.Null()]),
  heroCtaUrl: Type.Union([Type.String(), Type.Null()]),
  heroOverlayColor: Type.Union([Type.String(), Type.Null()]),
});

export type CategorySchema = Static<typeof categorySchema>;
export type AllCategoriesResponse = Static<typeof categorySchema>[];
export type MenuCategorySchema = Static<typeof menuCategorySchema>;
export type PublicCategoryPageSchema = Static<typeof publicCategoryPageSchema>;
