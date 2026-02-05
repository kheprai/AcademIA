CREATE TABLE IF NOT EXISTS "registration_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"phone" text NOT NULL,
	"source" text NOT NULL,
	"cart_snapshot" jsonb,
	"terms_accepted" boolean DEFAULT false NOT NULL,
	"registered" boolean DEFAULT false NOT NULL,
	"registered_at" timestamp (3) with time zone,
	"user_id" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "registration_attempts" ADD CONSTRAINT "registration_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reg_attempts_phone_idx" ON "registration_attempts" USING btree ("phone");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reg_attempts_registered_idx" ON "registration_attempts" USING btree ("registered");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reg_attempts_created_at_idx" ON "registration_attempts" USING btree ("created_at");
