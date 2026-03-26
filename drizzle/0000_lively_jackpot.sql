CREATE SCHEMA "origin";
--> statement-breakpoint
CREATE TYPE "public"."Status" AS ENUM('ACTIVE', 'INACTIVE', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('COMMON', 'ADMIN');--> statement-breakpoint
CREATE TABLE "origin"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"ref" serial NOT NULL,
	"status" "Status" DEFAULT 'ACTIVE' NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" varchar(27) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password_hash" text NOT NULL,
	"avatar_url" text,
	"features" bigint DEFAULT 0 NOT NULL,
	"role" "UserRole" DEFAULT 'COMMON' NOT NULL,
	CONSTRAINT "user_id_unique" UNIQUE("id"),
	CONSTRAINT "user_ref_unique" UNIQUE("ref"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
