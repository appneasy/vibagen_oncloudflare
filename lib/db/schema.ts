import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// ─── Article View Counts ──────────────────────────────────
export const articleViews = sqliteTable('article_views', {
  slug:      text('slug').primaryKey(),
  views:     int('views').notNull().default(0),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

// ─── Contact Form Submissions ─────────────────────────────
export const contacts = sqliteTable('contacts', {
  id:        int('id').primaryKey({ autoIncrement: true }),
  name:      text('name').notNull(),
  email:     text('email').notNull(),
  company:   text('company'),
  industry:  text('industry'),
  problem:   text('problem').notNull(),
  budget:    text('budget'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})

export type ArticleView = typeof articleViews.$inferSelect
export type Contact     = typeof contacts.$inferSelect
export type NewContact  = typeof contacts.$inferInsert

// ─── Managed Customers (Admin Panel) ────────────────────
export const managedCustomers = sqliteTable('managed_customers', {
  id:              int('id').primaryKey({ autoIncrement: true }),
  name:            text('name').notNull(),
  slug:            text('slug').notNull().unique(),
  subdomain:       text('subdomain').notNull().unique(),
  vpsIp:           text('vps_ip'),
  vpsPlan:         text('vps_plan').default('CPX22'),
  vpsLocation:     text('vps_location').default('nbg1'),
  r2Bucket:        text('r2_bucket'),
  status:          text('status').default('setup'),
  startDate:       text('start_date'),
  lineOaName:      text('line_oa_name'),
  liffId:          text('liff_id'),
  uptimeMonitorId: int('uptime_monitor_id'),
  notes:           text('notes'),
  createdAt:       text('created_at').default(sql`(datetime('now'))`),
  updatedAt:       text('updated_at').default(sql`(datetime('now'))`),
})

export type ManagedCustomer    = typeof managedCustomers.$inferSelect
export type NewManagedCustomer = typeof managedCustomers.$inferInsert

// ─── Customer Subscriptions ──────────────────────────────
export const customerSubscriptions = sqliteTable('customer_subscriptions', {
  id:            int('id').primaryKey({ autoIncrement: true }),
  customerSlug:  text('customer_slug').notNull(),
  provider:      text('provider').notNull(),         // 'cloudflare' | 'hetzner' | 'other'
  serviceName:   text('service_name').notNull(),     // 'VPS CPX22' | 'R2 Storage' | 'Domain'
  plan:          text('plan').default('monthly'),    // 'monthly' | 'yearly' | 'one-time'
  priceThb:      int('price_thb'),
  startDate:     text('start_date'),
  nextDueDate:   text('next_due_date'),
  autoRenew:     int('auto_renew').notNull().default(1),
  status:        text('status').default('active'),   // 'active' | 'cancelled' | 'expired'
  notes:         text('notes'),
  createdAt:     text('created_at').default(sql`(datetime('now'))`),
  updatedAt:     text('updated_at').default(sql`(datetime('now'))`),
})

export type CustomerSubscription    = typeof customerSubscriptions.$inferSelect
export type NewCustomerSubscription = typeof customerSubscriptions.$inferInsert

// ─── Customer Contracts ──────────────────────────────────
export const customerContracts = sqliteTable('customer_contracts', {
  id:            int('id').primaryKey({ autoIncrement: true }),
  customerSlug:  text('customer_slug').notNull(),
  title:         text('title').notNull(),              // 'สัญญาพัฒนาระบบ POS'
  type:          text('type').notNull().default('contract'), // 'contract' | 'quotation' | 'invoice' | 'requirement' | 'other'
  r2Key:         text('r2_key'),                       // path in R2 bucket e.g. 'contracts/contract-pos-2026.pdf'
  fileSize:      int('file_size'),                     // bytes
  status:        text('status').default('draft'),      // 'draft' | 'signed' | 'expired'
  signedDate:    text('signed_date'),
  expiryDate:    text('expiry_date'),
  notes:         text('notes'),
  createdAt:     text('created_at').default(sql`(datetime('now'))`),
  updatedAt:     text('updated_at').default(sql`(datetime('now'))`),
})

export type CustomerContract    = typeof customerContracts.$inferSelect
export type NewCustomerContract = typeof customerContracts.$inferInsert

// ─── Customer Apps ───────────────────────────────────────
export const customerApps = sqliteTable('customer_apps', {
  id:            int('id').primaryKey({ autoIncrement: true }),
  customerSlug:  text('customer_slug').notNull(),
  appType:       text('app_type').notNull(),           // 'pos' | 'crm' | 'hr' | 'inventory' | 'liff' | 'website' | 'custom'
  appName:       text('app_name').notNull(),            // 'AutoCar POS'
  version:       text('version'),                       // 'v1.2.0'
  deployUrl:     text('deploy_url'),                    // URL where deployed
  techStack:     text('tech_stack'),                    // 'Next.js + PostgreSQL'
  status:        text('status').default('development'), // 'development' | 'staging' | 'production' | 'retired'
  launchDate:    text('launch_date'),
  notes:         text('notes'),
  createdAt:     text('created_at').default(sql`(datetime('now'))`),
  updatedAt:     text('updated_at').default(sql`(datetime('now'))`),
})

export type CustomerApp    = typeof customerApps.$inferSelect
export type NewCustomerApp = typeof customerApps.$inferInsert

// ─── Uptime Monitors ─────────────────────────────────────
export const uptimeMonitors = sqliteTable('uptime_monitors', {
  id:              int('id').primaryKey({ autoIncrement: true }),
  customerSlug:    text('customer_slug'),          // optional link to managed_customers.slug
  url:             text('url').notNull(),
  label:           text('label').notNull(),
  checkInterval:   int('check_interval').notNull().default(300),  // seconds
  expectedStatus:  int('expected_status').notNull().default(200),
  expectedKeyword: text('expected_keyword'),        // optional keyword check
  isActive:        int('is_active').notNull().default(1),         // 1=active, 0=paused
  alertEmails:     text('alert_emails'),             // comma-separated
  telegramChatId:  text('telegram_chat_id'),
  createdAt:       text('created_at').default(sql`(datetime('now'))`),
  updatedAt:       text('updated_at').default(sql`(datetime('now'))`),
})

export type UptimeMonitor    = typeof uptimeMonitors.$inferSelect
export type NewUptimeMonitor = typeof uptimeMonitors.$inferInsert

// ─── Uptime Checks (raw results) ────────────────────────
export const uptimeChecks = sqliteTable('uptime_checks', {
  id:             int('id').primaryKey({ autoIncrement: true }),
  monitorId:      int('monitor_id').notNull(),
  status:         text('status').notNull(),          // 'up' | 'down'
  statusCode:     int('status_code'),
  responseTimeMs: int('response_time_ms'),
  errorMessage:   text('error_message'),
  region:         text('region'),                     // CF colo code
  checkedAt:      text('checked_at').notNull().default(sql`(datetime('now'))`),
})

export type UptimeCheck = typeof uptimeChecks.$inferSelect

// ─── Uptime Incidents ────────────────────────────────────
export const uptimeIncidents = sqliteTable('uptime_incidents', {
  id:              int('id').primaryKey({ autoIncrement: true }),
  monitorId:       int('monitor_id').notNull(),
  severity:        text('severity').notNull().default('major'), // 'minor' | 'major' | 'critical'
  startedAt:       text('started_at').notNull().default(sql`(datetime('now'))`),
  resolvedAt:      text('resolved_at'),
  durationSeconds: int('duration_seconds'),
  cause:           text('cause'),                    // manual note by admin
  createdAt:       text('created_at').default(sql`(datetime('now'))`),
})

export type UptimeIncident = typeof uptimeIncidents.$inferSelect

// ─── Uptime Maintenance Windows ──────────────────────────
export const uptimeMaintenance = sqliteTable('uptime_maintenance', {
  id:         int('id').primaryKey({ autoIncrement: true }),
  monitorId:  int('monitor_id').notNull(),
  startTime:  text('start_time').notNull(),
  endTime:    text('end_time').notNull(),
  reason:     text('reason'),
  createdAt:  text('created_at').default(sql`(datetime('now'))`),
})

export type UptimeMaintenance = typeof uptimeMaintenance.$inferSelect
