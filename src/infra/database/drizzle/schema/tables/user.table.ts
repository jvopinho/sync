import { text, varchar } from 'drizzle-orm/pg-core'

import {
  bitfield, commonFields, 
} from '../custom'
import { userRoleEnumPg } from '../enums/user-role-enum'
import { origin } from '../origin'

export const DrizzleUser = origin.table('user', {
  ...commonFields.make({ omit: ['workspace_id'] }),

  username: varchar('username', { length: 32 }).unique().notNull(),
  password_hash: text('password_hash').notNull(),

  avatar_url: text('avatar_url'),

  features: bitfield('features').notNull().default(0),
  role: userRoleEnumPg('role').notNull().default('COMMON'),
})

export type DrizzleUser = typeof DrizzleUser
