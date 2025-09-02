CREATE TABLE "maintenance_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"equipment" varchar(100) NOT NULL,
	"user" varchar(100) NOT NULL,
	"technician" varchar(100) NOT NULL,
	"date" timestamp NOT NULL,
	"tasks" json DEFAULT '[]'::json NOT NULL,
	"status" varchar(50) DEFAULT 'Pendiente' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
