-- Run this in your Supabase SQL editor to set up the database schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  preferences JSONB DEFAULT '{"topics": [], "language": "zh"}',
  push_subscription JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Articles table (fetched from RSS)
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_zh TEXT,
  url TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,
  summary_en TEXT,
  summary_zh TEXT,
  topics TEXT[],
  published_at TIMESTAMP,
  fetched_at TIMESTAMP DEFAULT NOW(),
  is_breaking BOOLEAN DEFAULT FALSE,
  category TEXT DEFAULT 'daily'
);

-- Daily digests table
CREATE TABLE IF NOT EXISTS daily_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  top_stories JSONB,
  trend_analysis_en TEXT,
  trend_analysis_zh TEXT,
  sea_opportunity_en TEXT,
  sea_opportunity_zh TEXT,
  sea_opportunity_admin TEXT,
  further_reading JSONB,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User interactions table (for personalization)
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  article_id UUID REFERENCES articles(id),
  action TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS articles_is_breaking_idx ON articles(is_breaking) WHERE is_breaking = TRUE;
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category);
CREATE INDEX IF NOT EXISTS daily_digests_date_idx ON daily_digests(date DESC);
CREATE INDEX IF NOT EXISTS user_interactions_user_id_idx ON user_interactions(user_id);

-- Row Level Security (enable after setting up auth)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own interactions" ON user_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own interactions" ON user_interactions FOR SELECT USING (auth.uid() = user_id);

-- Articles and digests are public
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Articles are public" ON articles FOR SELECT USING (true);

ALTER TABLE daily_digests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Digests are public" ON daily_digests FOR SELECT USING (true);

-- ── MIGRATION: Run this if you already have an existing articles table ──────
-- ALTER TABLE articles ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'daily';
-- CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category);
