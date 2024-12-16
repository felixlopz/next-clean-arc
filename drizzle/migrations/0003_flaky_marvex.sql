CREATE TABLE "emailVerificationRequests" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "emailVerificationRequests" ADD CONSTRAINT "emailVerificationRequests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;