CREATE TABLE IF NOT EXISTS customer_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_slug TEXT NOT NULL,
  provider TEXT NOT NULL,
  service_name TEXT NOT NULL,
  plan TEXT DEFAULT 'monthly',
  price_thb INTEGER,
  start_date TEXT,
  next_due_date TEXT,
  auto_renew INTEGER NOT NULL DEFAULT 1,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_subscriptions_customer ON customer_subscriptions(customer_slug);
CREATE INDEX idx_subscriptions_due_date ON customer_subscriptions(next_due_date);
