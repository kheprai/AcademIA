import { Type } from "@sinclair/typebox";

import type { InferInsertModel } from "drizzle-orm";
import type { categories } from "src/storage/schema";

export const categoryCreateSchema = Type.Object({
  title: Type.Record(Type.String(), Type.String()), // { en: "...", es: "..." }
  slug: Type.Optional(Type.String()),
});
export type CategoryInsert = Omit<InferInsertModel<typeof categories>, "slug"> & { slug?: string };
