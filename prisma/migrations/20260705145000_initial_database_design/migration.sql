-- Enable UUID generation for primary keys.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "UserRole" AS ENUM ('ADMIN');
CREATE TYPE "ProgramStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'CANCELLED');
CREATE TYPE "ResearchStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "ContactMessageStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

CREATE TABLE "users" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "full_name" VARCHAR(160) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "leadership" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "full_name" VARCHAR(160) NOT NULL,
  "position" VARCHAR(160) NOT NULL,
  "biography" TEXT NOT NULL,
  "photo" VARCHAR(2048),
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "leadership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "programs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" VARCHAR(220) NOT NULL,
  "slug" VARCHAR(240) NOT NULL,
  "description" TEXT NOT NULL,
  "event_date" TIMESTAMPTZ(6) NOT NULL,
  "location" VARCHAR(220) NOT NULL,
  "status" "ProgramStatus" NOT NULL DEFAULT 'DRAFT',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "research" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" VARCHAR(220) NOT NULL,
  "slug" VARCHAR(240) NOT NULL,
  "category" VARCHAR(120) NOT NULL,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "status" "ResearchStatus" NOT NULL DEFAULT 'DRAFT',
  "published_at" TIMESTAMPTZ(6) NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "research_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "archive" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" VARCHAR(220) NOT NULL,
  "slug" VARCHAR(240) NOT NULL,
  "summary" TEXT NOT NULL,
  "activity_date" TIMESTAMPTZ(6) NOT NULL,
  "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "archive_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "membership_applications" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "full_name" VARCHAR(160) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(40) NOT NULL,
  "university" VARCHAR(180) NOT NULL,
  "area_of_interest" VARCHAR(180) NOT NULL,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
  "submitted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "membership_applications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "contact_messages" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "full_name" VARCHAR(160) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "subject" VARCHAR(220) NOT NULL,
  "message" TEXT NOT NULL,
  "status" "ContactMessageStatus" NOT NULL DEFAULT 'UNREAD',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");
CREATE UNIQUE INDEX "leadership_full_name_position_key" ON "leadership" ("full_name", "position");
CREATE UNIQUE INDEX "programs_slug_key" ON "programs" ("slug");
CREATE INDEX "programs_event_date_idx" ON "programs" ("event_date");
CREATE INDEX "programs_status_idx" ON "programs" ("status");
CREATE UNIQUE INDEX "research_slug_key" ON "research" ("slug");
CREATE INDEX "research_category_idx" ON "research" ("category");
CREATE INDEX "research_published_at_idx" ON "research" ("published_at");
CREATE INDEX "research_status_idx" ON "research" ("status");
CREATE UNIQUE INDEX "archive_slug_key" ON "archive" ("slug");
CREATE INDEX "archive_activity_date_idx" ON "archive" ("activity_date");
CREATE INDEX "membership_applications_email_idx" ON "membership_applications" ("email");
CREATE INDEX "membership_applications_status_idx" ON "membership_applications" ("status");
CREATE INDEX "contact_messages_email_idx" ON "contact_messages" ("email");
CREATE INDEX "contact_messages_status_idx" ON "contact_messages" ("status");

-- Development sample administrator. Replace this account in production.
INSERT INTO "users" ("full_name", "email", "password", "role", "updated_at")
VALUES (
  'SSDU Sample Administrator',
  'admin@example.com',
  'scrypt$16384$8$1$ssdu-sample-admin-2026$W67pbUOzT0lvm7il7J5sVFKhz+6G6EkTGRakWTPwppiY4IHRROZ4N4k4kp86y5g0LlY7coEv/lUm92Uu0Ta70Q==',
  'ADMIN',
  CURRENT_TIMESTAMP
);
