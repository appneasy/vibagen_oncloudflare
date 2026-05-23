import { z } from 'zod'

export const customerCreateSchema = z.object({
  name:        z.string().min(1),
  slug:        z.string().min(1),
  subdomain:   z.string().min(1),
  vpsIp:       z.string().nullable().optional(),
  vpsPlan:     z.string().nullable().optional(),
  vpsLocation: z.string().nullable().optional(),
  r2Bucket:    z.string().nullable().optional(),
  status:      z.enum(['setup', 'active', 'suspended', 'terminated']).optional(),
  startDate:   z.string().nullable().optional(),
  lineOaName:  z.string().nullable().optional(),
  liffId:      z.string().nullable().optional(),
  notes:       z.string().nullable().optional(),
})

export const customerUpdateSchema = z.object({
  name:        z.string().min(1).optional(),
  slug:        z.string().min(1).optional(),
  subdomain:   z.string().min(1).optional(),
  vpsIp:       z.string().nullable().optional(),
  vpsPlan:     z.string().nullable().optional(),
  vpsLocation: z.string().nullable().optional(),
  r2Bucket:    z.string().nullable().optional(),
  status:      z.enum(['setup', 'active', 'suspended', 'terminated']).optional(),
  startDate:   z.string().nullable().optional(),
  lineOaName:  z.string().nullable().optional(),
  liffId:      z.string().nullable().optional(),
  notes:       z.string().nullable().optional(),
})

export type CustomerCreateInput = z.infer<typeof customerCreateSchema>
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>
