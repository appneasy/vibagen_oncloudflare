export const runtime = 'edge'

import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { managedCustomers } from '@/lib/db/schema'
import type { ManagedCustomer } from '@/lib/db/schema'
import DeleteCustomerButton from './DeleteCustomerButton'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  active:     { bg: '#d1fae5', color: '#065f46', label: 'Active' },
  setup:      { bg: '#dbeafe', color: '#1e40af', label: 'Setup' },
  suspended:  { bg: '#fef3c7', color: '#92400e', label: 'Suspended' },
  terminated: { bg: '#fee2e2', color: '#991b1b', label: 'Terminated' },
}

function DetailField({ label, value, mono = false }: { label: string; value: string | null | undefined; mono?: boolean }) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#0d2749',
          marginBottom: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: value ? '#374151' : '#9ca3af',
          fontFamily: mono ? 'monospace' : 'inherit',
        }}
      >
        {value ?? '—'}
      </div>
    </div>
  )
}

export default async function CustomerDetailPage({
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

  const statusBadge = STATUS_BADGE[customer.status ?? 'setup'] ?? STATUS_BADGE.setup

  return (
    <div>
      {/* ── Back link ── */}
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

      {/* ── Info card ── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '24px',
          marginBottom: 20,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e9f0',
        }}
      >
        {/* Name + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: 'var(--font-prompt)',
              fontWeight: 700,
              fontSize: 26,
              color: '#0d2749',
              margin: 0,
            }}
          >
            {customer.name}
          </h1>
          <span
            style={{
              padding: '3px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: statusBadge.bg,
              color: statusBadge.color,
            }}
          >
            {statusBadge.label}
          </span>
        </div>

        {/* Detail grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '20px 32px',
          }}
        >
          <DetailField label="Slug"          value={customer.slug}        mono />
          <DetailField label="Subdomain"     value={customer.subdomain}   mono />
          <DetailField label="VPS IP"        value={customer.vpsIp}       mono />
          <DetailField label="VPS Plan"      value={customer.vpsPlan}     mono />
          <DetailField label="VPS Location"  value={customer.vpsLocation} mono />
          <DetailField label="R2 Bucket"     value={customer.r2Bucket}    mono />
          <DetailField label="Start Date"    value={customer.startDate}        />
          <DetailField label="LINE OA"       value={customer.lineOaName}       />
          <DetailField label="LIFF ID"       value={customer.liffId}      mono />
        </div>

        {/* Notes — full width */}
        {customer.notes && (
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f0f4f8' }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#0d2749',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Notes
            </div>
            <div style={{ fontSize: 14, color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {customer.notes}
            </div>
          </div>
        )}
      </div>

      {/* ── Action buttons ── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link
          href={`/admin/customers/${slug}/edit`}
          style={{
            background: '#ff6c01',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Edit
        </Link>

        {customer.r2Bucket && (
          <Link
            href={`/admin/backups/${slug}`}
            style={{
              background: 'transparent',
              color: '#0d2749',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              padding: '10px 24px',
              fontWeight: 500,
              fontSize: 14,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            View Backups
          </Link>
        )}

        <DeleteCustomerButton slug={slug} name={customer.name} />
      </div>
    </div>
  )
}
