import z from 'zod'

import { zUserRole } from '@/@types/custom-zod-types'

import { BaseBody } from '../base/domain/entities/base.schema'

export const UserBody = BaseBody
  .omit({
    workspace_id: true, company_id: true, 
  })
  .extend({
    name: z.string(),
    username: z.string(),
    email: z.email(),
    avatar_url: z.string().optional().nullable(),
    features: z.coerce.string(),
    role: zUserRole().default('COMMON'),
  })
export type UserBody = z.infer<typeof UserBody>