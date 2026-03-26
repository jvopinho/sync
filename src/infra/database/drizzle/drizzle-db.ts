import { drizzleHelper } from './drizzle-helper'

export const db = await drizzleHelper.getDatabase()
