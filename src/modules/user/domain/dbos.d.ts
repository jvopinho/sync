import { InferSelectModel } from 'drizzle-orm'

import {
  DrizzleUser,
} from '@/infra/database/drizzle/schema/tables'

export type UserDBO = InferSelectModel<DrizzleUser>
