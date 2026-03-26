ALTER TABLE "origin"."user" RENAME COLUMN "email" TO "username";--> statement-breakpoint
ALTER TABLE "origin"."user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "origin"."user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");