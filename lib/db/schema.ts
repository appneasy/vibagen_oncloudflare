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
