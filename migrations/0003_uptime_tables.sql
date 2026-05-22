-- Uptime Monitors
CREATE TABLE IF NOT EXISTS uptime_monitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_slug TEXT,
  url TEXT NOT NULL,
  label TEXT NOT NULL,
  check_interval INTEGER NOT NULL DEFAULT 300,
  expected_status INTEGER NOT NULL DEFAULT 200,
  expected_keyword TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  alert_emails TEXT,
  telegram_chat_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_uptime_monitors_customer ON uptime_monitors(customer_slug);
CREATE INDEX IF NOT EXISTS idx_uptime_monitors_active ON uptime_monitors(is_active);

-- Uptime Checks (raw results)
CREATE TABLE IF NOT EXISTS uptime_checks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monitor_id INTEGER NOT NULL REFERENCES uptime_monitors(id),
  status TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  error_message TEXT,
  region TEXT,
  checked_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_uptime_checks_monitor ON uptime_checks(monitor_id);
CREATE INDEX IF NOT EXISTS idx_uptime_checks_time ON uptime_checks(checked_at);
CREATE INDEX IF NOT EXISTS idx_uptime_checks_monitor_time ON uptime_checks(monitor_id, checked_at);

-- Uptime Incidents
CREATE TABLE IF NOT EXISTS uptime_incidents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monitor_id INTEGER NOT NULL REFERENCES uptime_monitors(id),
  severity TEXT NOT NULL DEFAULT 'major',
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT,
  duration_seconds INTEGER,
  cause TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_uptime_incidents_monitor ON uptime_incidents(monitor_id);
CREATE INDEX IF NOT EXISTS idx_uptime_incidents_open ON uptime_incidents(resolved_at) WHERE resolved_at IS NULL;

-- Uptime Maintenance Windows
CREATE TABLE IF NOT EXISTS uptime_maintenance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monitor_id INTEGER NOT NULL REFERENCES uptime_monitors(id),
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  reason TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_uptime_maintenance_monitor ON uptime_maintenance(monitor_id);
CREATE INDEX IF NOT EXISTS idx_uptime_maintenance_window ON uptime_maintenance(start_time, end_time);
