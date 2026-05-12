-- VIBAGEN D1 Database — Initial Migration
-- Run: wrangler d1 execute vibagen-db --file ./migrations/0001_init.sql

CREATE TABLE IF NOT EXISTS article_views (
  slug       TEXT PRIMARY KEY,
  views      INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contacts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  company    TEXT,
  industry   TEXT,
  problem    TEXT NOT NULL,
  budget     TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contacts_email    ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created  ON contacts(created_at);
