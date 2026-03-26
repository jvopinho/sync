import { sql } from 'drizzle-orm'
import { pgSchema } from 'drizzle-orm/pg-core'

const schemaName = 'origin'

export const databaseSchemaName = schemaName as string
export const schemaPrefix = sql.raw(`${databaseSchemaName}`)
export const origin = pgSchema(schemaName)
