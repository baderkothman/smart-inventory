CREATE TYPE "public"."asset_category" AS ENUM('laptop', 'monitor', 'license', 'peripheral', 'server', 'mobile', 'other');--> statement-breakpoint
CREATE TYPE "public"."asset_status" AS ENUM('active', 'inactive', 'maintenance', 'retired', 'assigned');--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"category" "asset_category" NOT NULL,
	"status" "asset_status" DEFAULT 'active' NOT NULL,
	"serial_number" text,
	"manufacturer" text,
	"model" text,
	"purchase_date" text,
	"location" text,
	"assigned_to" text,
	"description" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
