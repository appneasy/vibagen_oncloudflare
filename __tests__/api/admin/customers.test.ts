import { describe, it, expect } from 'vitest'
import { customerCreateSchema, customerUpdateSchema } from '@/lib/validators/customer'

// ─── customerCreateSchema ──────────────────────────────────────────────────

describe('customerCreateSchema', () => {
  // 1. Valid complete data (all fields) → passes
  it('accepts valid complete data with all fields', () => {
    const result = customerCreateSchema.safeParse({
      name:        'AutoCar Care',
      slug:        'autocar-care',
      subdomain:   'autocar',
      vpsIp:       '1.2.3.4',
      vpsPlan:     'CPX22',
      vpsLocation: 'nbg1',
      r2Bucket:    'autocar-backup',
      status:      'active',
      startDate:   '2026-01-01',
      lineOaName:  'AutoCar LINE',
      liffId:      'liff.1234567890-abcdefgh',
      notes:       'VIP customer',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('AutoCar Care')
      expect(result.data.status).toBe('active')
    }
  })

  // 2. Valid minimal data (only name, slug, subdomain) → passes
  it('accepts valid minimal data with only required fields', () => {
    const result = customerCreateSchema.safeParse({
      name:      'Test Corp',
      slug:      'test-corp',
      subdomain: 'test',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Test Corp')
      expect(result.data.vpsIp).toBeUndefined()
    }
  })

  // 3. Null optional fields → passes ← THIS WAS THE BUG
  it('accepts null for optional fields (the core bug fix)', () => {
    const result = customerCreateSchema.safeParse({
      name:        'Test Corp',
      slug:        'test-corp',
      subdomain:   'test',
      vpsIp:       null,
      vpsPlan:     null,
      vpsLocation: null,
      r2Bucket:    null,
      startDate:   null,
      lineOaName:  null,
      liffId:      null,
      notes:       null,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.vpsIp).toBeNull()
      expect(result.data.vpsPlan).toBeNull()
      expect(result.data.vpsLocation).toBeNull()
      expect(result.data.r2Bucket).toBeNull()
      expect(result.data.startDate).toBeNull()
      expect(result.data.lineOaName).toBeNull()
      expect(result.data.liffId).toBeNull()
      expect(result.data.notes).toBeNull()
    }
  })

  // 4. Missing name → fails with error on 'name'
  it('rejects missing name field', () => {
    const result = customerCreateSchema.safeParse({
      slug:      'test-corp',
      subdomain: 'test',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('name')
    }
  })

  // 5. Missing slug → fails with error on 'slug'
  it('rejects missing slug field', () => {
    const result = customerCreateSchema.safeParse({
      name:      'Test Corp',
      subdomain: 'test',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('slug')
    }
  })

  // 6. Missing subdomain → fails with error on 'subdomain'
  it('rejects missing subdomain field', () => {
    const result = customerCreateSchema.safeParse({
      name: 'Test Corp',
      slug: 'test-corp',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('subdomain')
    }
  })

  // 7. Empty string name (name: '') → fails (min(1))
  it('rejects empty string name', () => {
    const result = customerCreateSchema.safeParse({
      name:      '',
      slug:      'test-corp',
      subdomain: 'test',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('name')
    }
  })

  // 8. Empty string slug → fails
  it('rejects empty string slug', () => {
    const result = customerCreateSchema.safeParse({
      name:      'Test Corp',
      slug:      '',
      subdomain: 'test',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('slug')
    }
  })

  // 9. Empty string subdomain → fails
  it('rejects empty string subdomain', () => {
    const result = customerCreateSchema.safeParse({
      name:      'Test Corp',
      slug:      'test-corp',
      subdomain: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('subdomain')
    }
  })

  // 10. Invalid status value → fails
  it('rejects invalid status value', () => {
    const result = customerCreateSchema.safeParse({
      name:      'Test Corp',
      slug:      'test-corp',
      subdomain: 'test',
      status:    'invalid-status',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('status')
    }
  })

  // 11. Each valid status value → passes
  it.each(['setup', 'active', 'suspended', 'terminated'] as const)(
    'accepts valid status value: %s',
    (status) => {
      const result = customerCreateSchema.safeParse({
        name:      'Test Corp',
        slug:      'test-corp',
        subdomain: 'test',
        status,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe(status)
      }
    },
  )

  // 12. Extra unknown fields → stripped/passes (Zod strips unknown by default)
  it('strips unknown extra fields and passes', () => {
    const result = customerCreateSchema.safeParse({
      name:        'Test Corp',
      slug:        'test-corp',
      subdomain:   'test',
      unknownField: 'should be stripped',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty('unknownField')
    }
  })
})

// ─── customerUpdateSchema ──────────────────────────────────────────────────

describe('customerUpdateSchema', () => {
  // 1. Valid complete update (all fields) → passes
  it('accepts valid complete update with all fields', () => {
    const result = customerUpdateSchema.safeParse({
      name:        'Updated Corp',
      slug:        'updated-corp',
      subdomain:   'updated',
      vpsIp:       '5.6.7.8',
      vpsPlan:     'CPX32',
      vpsLocation: 'fsn1',
      r2Bucket:    'updated-bucket',
      status:      'suspended',
      startDate:   '2026-02-01',
      lineOaName:  'Updated LINE',
      liffId:      'liff.0987654321-hgfedcba',
      notes:       'Updated notes',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Updated Corp')
      expect(result.data.status).toBe('suspended')
    }
  })

  // 2. Valid partial update (only name) → passes
  it('accepts partial update with only name', () => {
    const result = customerUpdateSchema.safeParse({ name: 'New Name' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('New Name')
      expect(result.data.slug).toBeUndefined()
    }
  })

  // 3. Null optional fields → passes ← THIS WAS THE BUG
  it('accepts null for optional fields (the core bug fix)', () => {
    const result = customerUpdateSchema.safeParse({
      name:        'Test Corp',
      vpsIp:       null,
      vpsPlan:     null,
      vpsLocation: null,
      r2Bucket:    null,
      startDate:   null,
      lineOaName:  null,
      liffId:      null,
      notes:       null,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.vpsIp).toBeNull()
      expect(result.data.vpsPlan).toBeNull()
      expect(result.data.vpsLocation).toBeNull()
      expect(result.data.r2Bucket).toBeNull()
      expect(result.data.startDate).toBeNull()
      expect(result.data.lineOaName).toBeNull()
      expect(result.data.liffId).toBeNull()
      expect(result.data.notes).toBeNull()
    }
  })

  // 4. Empty name (name: '') → fails (min(1))
  it('rejects empty string name', () => {
    const result = customerUpdateSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('name')
    }
  })

  // 5. Empty object {} → passes (all optional)
  it('accepts empty object (all fields optional)', () => {
    const result = customerUpdateSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({})
    }
  })

  // 6. Invalid status → fails
  it('rejects invalid status value', () => {
    const result = customerUpdateSchema.safeParse({ status: 'unknown' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('status')
    }
  })

  // 7. Mixed valid string + null fields → passes
  it('accepts mix of string values and null fields', () => {
    const result = customerUpdateSchema.safeParse({
      name:    'Keep Name',
      vpsIp:   null,
      notes:   null,
      status:  'active',
      r2Bucket: 'my-bucket',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Keep Name')
      expect(result.data.vpsIp).toBeNull()
      expect(result.data.notes).toBeNull()
      expect(result.data.status).toBe('active')
      expect(result.data.r2Bucket).toBe('my-bucket')
    }
  })

  // 8. Only status field → passes
  it('accepts update with only status field', () => {
    const result = customerUpdateSchema.safeParse({ status: 'terminated' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('terminated')
    }
  })

  // 9. slug + subdomain only → passes
  it('accepts update with only slug and subdomain', () => {
    const result = customerUpdateSchema.safeParse({
      slug:      'new-slug',
      subdomain: 'new-sub',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.slug).toBe('new-slug')
      expect(result.data.subdomain).toBe('new-sub')
    }
  })
})
