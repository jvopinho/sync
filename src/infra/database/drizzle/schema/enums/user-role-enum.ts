import { pgEnum } from 'drizzle-orm/pg-core'

import { extractKeys } from '@/utils/object-utils'

import { UserRole } from '@/@types/enums'

export const userRoleEnumPg = pgEnum('UserRole', extractKeys(UserRole) as [UserRole, ...UserRole[]])