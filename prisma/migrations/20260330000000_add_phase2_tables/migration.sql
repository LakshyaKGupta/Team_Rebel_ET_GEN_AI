-- CreateTable portfolios
CREATE TABLE "portfolios" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable holdings
CREATE TABLE "holdings" (
    "id" TEXT NOT NULL,
    "portfolio_id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "purchase_price" DOUBLE PRECISION NOT NULL,
    "current_price" DOUBLE PRECISION NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "sector" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable alerts
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "portfolio_id" TEXT,
    "holding_id" TEXT,
    "asset_symbol" TEXT NOT NULL,
    "alert_type" TEXT NOT NULL,
    "threshold" DOUBLE PRECISION,
    "importance" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable engagements
CREATE TABLE "engagements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "read_time_seconds" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "engagements_pkey" PRIMARY KEY ("id")
);

-- CreateTable reading_patterns
CREATE TABLE "reading_patterns" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "read_count" INTEGER NOT NULL DEFAULT 0,
    "total_time_minutes" INTEGER NOT NULL DEFAULT 0,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable share_tracking
CREATE TABLE "share_tracking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "share_count" INTEGER NOT NULL DEFAULT 1,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "last_shared" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "share_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable email_digest_configs
CREATE TABLE "email_digest_configs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "frequency" TEXT NOT NULL DEFAULT 'daily',
    "send_time" TEXT NOT NULL DEFAULT '09:00',
    "topics" TEXT NOT NULL DEFAULT '',
    "include_portfolio" BOOLEAN NOT NULL DEFAULT false,
    "include_analytics" BOOLEAN NOT NULL DEFAULT false,
    "is_subscribed" BOOLEAN NOT NULL DEFAULT true,
    "timezone" TEXT DEFAULT 'UTC',
    "last_sent" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_digest_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable digest_deliveries
CREATE TABLE "digest_deliveries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "digest_id" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMP(3),
    "opened_at" TIMESTAMP(3),
    "clicked_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'sent',
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "digest_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for engagements
CREATE INDEX "engagements_user_id_idx" ON "engagements"("user_id");
CREATE INDEX "engagements_article_id_idx" ON "engagements"("article_id");
CREATE INDEX "engagements_timestamp_idx" ON "engagements"("timestamp");

-- CreateIndex for digest_deliveries
CREATE INDEX "digest_deliveries_user_id_idx" ON "digest_deliveries"("user_id");
CREATE INDEX "digest_deliveries_sent_at_idx" ON "digest_deliveries"("sent_at");

-- CreateUniqueIndex for holdings (linking to portfolios)
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolios" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateUniqueIndex for alerts (linking to portfolios and holdings)
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolios" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_holding_id_fkey" FOREIGN KEY ("holding_id") REFERENCES "holdings" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateUniqueIndex for reading_patterns
CREATE UNIQUE INDEX "reading_patterns_user_id_hour_key" ON "reading_patterns"("user_id", "hour");

-- CreateUniqueIndex for share_tracking
CREATE UNIQUE INDEX "share_tracking_user_id_content_id_platform_key" ON "share_tracking"("user_id", "content_id", "platform");

-- CreateUniqueIndex for email_digest_configs
CREATE UNIQUE INDEX "email_digest_configs_user_id_key" ON "email_digest_configs"("user_id");
