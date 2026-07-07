ALTER TYPE "ResearchStatus" RENAME TO "BlogStatus";

ALTER TABLE "research" RENAME TO "blog";

ALTER INDEX IF EXISTS "research_slug_key" RENAME TO "blog_slug_key";
ALTER INDEX IF EXISTS "research_category_idx" RENAME TO "blog_category_idx";
ALTER INDEX IF EXISTS "research_published_at_idx" RENAME TO "blog_published_at_idx";
ALTER INDEX IF EXISTS "research_status_idx" RENAME TO "blog_status_idx";
ALTER TABLE "blog" RENAME CONSTRAINT "research_pkey" TO "blog_pkey";

CREATE TABLE "blog_media" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "blog_id" UUID NOT NULL,
  "url" VARCHAR(2048) NOT NULL,
  "alt_text" VARCHAR(220),
  "mime_type" VARCHAR(120) NOT NULL,
  "size_bytes" INTEGER,
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "blog_media_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "blog_media_blog_id_fkey"
    FOREIGN KEY ("blog_id")
    REFERENCES "blog"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX "blog_media_blog_id_idx" ON "blog_media" ("blog_id");
