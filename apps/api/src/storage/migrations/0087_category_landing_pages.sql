-- Add category landing page columns
ALTER TABLE "categories" ADD COLUMN "slug" text;
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "show_in_menu" boolean NOT NULL DEFAULT false;
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "display_order" integer;
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "hero_image_s3_key" text;
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "hero_title" jsonb;
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "hero_subtitle" jsonb;
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "hero_cta_text" jsonb;
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "hero_cta_url" text;
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "hero_overlay_color" text;
--> statement-breakpoint

-- Generate slugs from existing category titles (english title)
-- Uses lower() + regexp_replace for slug generation, with numeric suffix for duplicates
DO $$
DECLARE
  cat RECORD;
  base_slug TEXT;
  final_slug TEXT;
  slug_count INTEGER;
BEGIN
  FOR cat IN SELECT id, title FROM categories ORDER BY created_at ASC LOOP
    -- Extract english title, fallback to first available
    base_slug := COALESCE(cat.title->>'en', (SELECT value FROM jsonb_each_text(cat.title) LIMIT 1));
    -- Convert to slug: lowercase, replace non-alphanumeric with hyphens, trim hyphens
    base_slug := lower(base_slug);
    base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
    base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g');

    -- Handle empty slug
    IF base_slug = '' OR base_slug IS NULL THEN
      base_slug := 'category';
    END IF;

    -- Check for duplicates and add numeric suffix if needed
    final_slug := base_slug;
    slug_count := 0;
    WHILE EXISTS (SELECT 1 FROM categories WHERE slug = final_slug AND id != cat.id) LOOP
      slug_count := slug_count + 1;
      final_slug := base_slug || '-' || slug_count;
    END LOOP;

    UPDATE categories SET slug = final_slug WHERE id = cat.id;
  END LOOP;
END $$;
--> statement-breakpoint

-- Now make slug NOT NULL and UNIQUE
ALTER TABLE "categories" ALTER COLUMN "slug" SET NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_unique_idx" ON "categories" USING btree ("slug");
--> statement-breakpoint

-- Add is_featured to courses
ALTER TABLE "courses" ADD COLUMN "is_featured" boolean NOT NULL DEFAULT false;
