import { pgEnum } from 'drizzle-orm/pg-core'

import { extractKeys } from '@/utils/object-utils'

import { Status } from '@/@types/enums/status'

export const statusEnumPg = pgEnum('Status', extractKeys(Status) as [Status, ...Status[]])