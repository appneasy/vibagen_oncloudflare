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
