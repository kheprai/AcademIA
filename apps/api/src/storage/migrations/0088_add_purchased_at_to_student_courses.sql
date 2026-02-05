ALTER TABLE "student_courses"
  ADD COLUMN "purchased_at" timestamp(3) with time zone;

-- Backfill: ALL existing enrolled users get purchased_at = enrolled_at
-- (preserves their current full access — safe migration)
UPDATE "student_courses"
  SET "purchased_at" = "enrolled_at"
  WHERE "status" = 'enrolled';
