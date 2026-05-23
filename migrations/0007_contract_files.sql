CREATE TABLE IF NOT EXISTS contract_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contract_id INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  label TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
