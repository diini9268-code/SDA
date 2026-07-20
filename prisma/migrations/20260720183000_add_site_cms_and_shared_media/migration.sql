-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "SitePage" AS ENUM ('GLOBAL', 'HOME', 'ABOUT', 'BLOG', 'MEMBERSHIP', 'LEADERSHIP', 'CONTACT');

-- CreateEnum
CREATE TYPE "MediaAssetStatus" AS ENUM ('PENDING', 'READY');

-- CreateEnum
CREATE TYPE "MediaAssetKind" AS ENUM ('IMAGE', 'DOCUMENT');

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "storage_path" VARCHAR(1024) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "alt_text" VARCHAR(220),
    "mime_type" VARCHAR(120) NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "kind" "MediaAssetKind" NOT NULL,
    "status" "MediaAssetStatus" NOT NULL DEFAULT 'READY',
    "created_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archive_media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "archive_id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archive_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_sections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "page" "SitePage" NOT NULL,
    "key" VARCHAR(120) NOT NULL,
    "title" VARCHAR(220),
    "content" JSONB NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "updated_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_section_media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "section_id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "role" VARCHAR(80) NOT NULL DEFAULT 'image',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_section_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(220) NOT NULL,
    "website" VARCHAR(2048),
    "logo_asset_id" UUID,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" VARCHAR(100) NOT NULL,
    "href" VARCHAR(500) NOT NULL,
    "location" VARCHAR(40) NOT NULL DEFAULT 'header',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "navigation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_revisions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entity_type" VARCHAR(80) NOT NULL,
    "entity_id" VARCHAR(120) NOT NULL,
    "snapshot" JSONB NOT NULL,
    "changed_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_revisions_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "leadership" ADD COLUMN "photo_asset_id" UUID;

-- AlterTable
ALTER TABLE "programs" ADD COLUMN "cover_asset_id" UUID;

-- AlterTable
ALTER TABLE "blog_media" ADD COLUMN "asset_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_storage_path_key" ON "media_assets"("storage_path");
CREATE INDEX "media_assets_kind_status_idx" ON "media_assets"("kind", "status");
CREATE INDEX "media_assets_created_at_idx" ON "media_assets"("created_at");
CREATE UNIQUE INDEX "archive_media_archive_id_asset_id_key" ON "archive_media"("archive_id", "asset_id");
CREATE INDEX "archive_media_archive_id_display_order_idx" ON "archive_media"("archive_id", "display_order");
CREATE UNIQUE INDEX "page_sections_page_key_key" ON "page_sections"("page", "key");
CREATE INDEX "page_sections_page_status_is_visible_display_order_idx" ON "page_sections"("page", "status", "is_visible", "display_order");
CREATE UNIQUE INDEX "page_section_media_section_id_asset_id_role_key" ON "page_section_media"("section_id", "asset_id", "role");
CREATE INDEX "page_section_media_section_id_display_order_idx" ON "page_section_media"("section_id", "display_order");
CREATE UNIQUE INDEX "partners_name_key" ON "partners"("name");
CREATE INDEX "partners_is_active_display_order_idx" ON "partners"("is_active", "display_order");
CREATE UNIQUE INDEX "navigation_items_location_href_key" ON "navigation_items"("location", "href");
CREATE INDEX "navigation_items_location_is_visible_display_order_idx" ON "navigation_items"("location", "is_visible", "display_order");
CREATE INDEX "content_revisions_entity_type_entity_id_created_at_idx" ON "content_revisions"("entity_type", "entity_id", "created_at");

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "leadership" ADD CONSTRAINT "leadership_photo_asset_id_fkey" FOREIGN KEY ("photo_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "programs" ADD CONSTRAINT "programs_cover_asset_id_fkey" FOREIGN KEY ("cover_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "blog_media" ADD CONSTRAINT "blog_media_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "archive_media" ADD CONSTRAINT "archive_media_archive_id_fkey" FOREIGN KEY ("archive_id") REFERENCES "archive"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "archive_media" ADD CONSTRAINT "archive_media_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "page_section_media" ADD CONSTRAINT "page_section_media_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "page_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "page_section_media" ADD CONSTRAINT "page_section_media_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_asset_id_fkey" FOREIGN KEY ("logo_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "content_revisions" ADD CONSTRAINT "content_revisions_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
