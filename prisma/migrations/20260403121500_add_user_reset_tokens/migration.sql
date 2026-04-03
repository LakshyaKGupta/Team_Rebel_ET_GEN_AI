ALTER TABLE "users"
ADD COLUMN "reset_token" TEXT,
ADD COLUMN "reset_token_expiry" TIMESTAMP(3);

ALTER TABLE "engagements"
ADD COLUMN "context" TEXT;
