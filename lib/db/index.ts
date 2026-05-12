import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

// Usage in API routes:
//   import { getDB } from '@/lib/db'
//   const db = getDB(env.DB)
export function getDB(d1: D1Database) {
  return drizzle(d1, { schema })
}
