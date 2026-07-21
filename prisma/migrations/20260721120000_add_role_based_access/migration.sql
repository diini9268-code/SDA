ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'BLOGGER';

ALTER TABLE "users"
ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "blog"
ADD COLUMN "author_id" UUID;

UPDATE "blog"
SET "author_id" = (
  SELECT "id"
  FROM "users"
  WHERE "role" = 'ADMIN'
  ORDER BY "created_at" ASC
  LIMIT 1
)
WHERE "author_id" IS NULL;

CREATE INDEX "blog_author_id_idx" ON "blog"("author_id");

ALTER TABLE "blog"
ADD CONSTRAINT "blog_author_id_fkey"
FOREIGN KEY ("author_id") REFERENCES "users"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
