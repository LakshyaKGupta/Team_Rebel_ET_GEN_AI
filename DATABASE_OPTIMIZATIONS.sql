-- Database Query Optimization Guide
-- This file contains recommended indexes for the ET Gen AI database

-- Index on UserPreference for faster user preference lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_type ON user_preferences(user_type);

-- Index on Articles for category filtering and date sorting
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_sentiment ON articles(sentiment);

-- Index on Stories for timeline and category filtering
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_timeline ON stories(timeline);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);

-- Index on SavedStory for user-specific queries
CREATE INDEX IF NOT EXISTS idx_saved_stories_user_id ON saved_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_stories_created_at ON saved_stories(created_at DESC);

-- Index on StoryArticle for story-specific queries
CREATE INDEX IF NOT EXISTS idx_story_articles_story_id ON story_articles(story_id);
CREATE INDEX IF NOT EXISTS idx_story_articles_article_id ON story_articles(article_id);
CREATE INDEX IF NOT EXISTS idx_story_articles_position ON story_articles(story_id, position);

-- Index on QALog for conversation history
CREATE INDEX IF NOT EXISTS idx_qa_logs_user_id ON qa_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_qa_logs_conversation_id ON qa_logs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_qa_logs_created_at ON qa_logs(created_at DESC);

-- Index on BriefingCache for faster cache lookups
CREATE INDEX IF NOT EXISTS idx_briefing_cache_user_id ON briefing_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_briefing_cache_expires_at ON briefing_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_briefing_cache_user_topic_mode ON briefing_cache(user_id, topic, mode);

-- Index on Users for faster email lookup during login
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on IngestionLog for status tracking
CREATE INDEX IF NOT EXISTS idx_ingestion_logs_created_at ON ingestion_logs(created_at DESC);
