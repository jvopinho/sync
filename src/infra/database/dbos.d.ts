import { InferSelectModel } from 'drizzle-orm'

import {
  DrizzleUser,
} from './drizzle/schema/tables'

export type UserDBO = InferSelectModel<DrizzleUser>
