export const runtime = 'edge'

import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { managedCustomers } from '@/lib/db/schema'
import type { ManagedCustomer } from '@/lib/db/schema'
import CustomerForm from '@/components/admin/CustomerForm'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const env = await getCfEnv()

  let customer: ManagedCustomer | null = null
  let dbError = false

  if (env?.DB) {
    try {
      const db = getDB(env.DB)
      const row = await db
        .select()
        .from(managedCustomers)
        .where(eq(managedCustomers.slug, slug))
        .get()
      customer = row ?? null
    } catch {
      dbError = true
    }
  } else {
    dbError = true
  }

  if (!customer) {
    return (
      <div>
        <Link
          href="/admin/customers"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            color: '#ff6c01',
            textDecoration: 'none',
            marginBottom: 20,
          }}
        >
          ← Customers
        </Link>
        <div
          style={{
            marginTop: 40,
            textAlign: 'center',
            color: '#737373',
            fontSize: 15,
          }}
        >
          {dbError ? 'ไม่สามารถโหลดข้อมูลได้' : 'Customer not found'}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ── Back link ── */}
      <Link
        href={`/admin/customers/${slug}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 14,
          color: '#ff6c01',
          textDecoration: 'none',
          marginBottom: 20,
        }}
      >
        ← {customer.name}
      </Link>

      {/* ── Page title ── */}
      <h1
        style={{
          fontFamily: 'var(--font-prompt)',
          fontWeight: 700,
          fontSize: 28,
          color: '#0d2749',
          margin: '0 0 24px',
          lineHeight: 1.2,
        }}
      >
        Edit Customer
      </h1>

      <CustomerForm mode="edit" initialData={customer} slug={slug} />
    </div>
  )
}
