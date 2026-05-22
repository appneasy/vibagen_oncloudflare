CREATE TABLE IF NOT EXISTS customer_apps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_slug TEXT NOT NULL,
  app_type TEXT NOT NULL,
  app_name TEXT NOT NULL,
  version TEXT,
  deploy_url TEXT,
  tech_stack TEXT,
  status TEXT DEFAULT 'development',
  launch_date TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_apps_customer ON customer_apps(customer_slug);
