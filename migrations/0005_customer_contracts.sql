CREATE TABLE IF NOT EXISTS customer_contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'contract',
  r2_key TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'draft',
  signed_date TEXT,
  expiry_date TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_contracts_customer ON customer_contracts(customer_slug);
