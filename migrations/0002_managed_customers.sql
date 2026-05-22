-- Managed Customers — Admin Panel Phase 1
-- Run: wrangler d1 execute vibagen-db --file ./migrations/0002_managed_customers.sql

CREATE TABLE IF NOT EXISTS managed_customers (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  subdomain        TEXT NOT NULL UNIQUE,
  vps_ip           TEXT,
  vps_plan         TEXT DEFAULT 'CPX22',
  vps_location     TEXT DEFAULT 'nbg1',
  r2_bucket        TEXT,
  status           TEXT DEFAULT 'setup',
  start_date       TEXT,
  line_oa_name     TEXT,
  liff_id          TEXT,
  uptime_monitor_id INTEGER,
  notes            TEXT,
  created_at       TEXT DEFAULT (datetime('now')),
  updated_at       TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_managed_customers_slug ON managed_customers(slug);
CREATE INDEX IF NOT EXISTS idx_managed_customers_status ON managed_customers(status);
