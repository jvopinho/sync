import { sql } from 'drizzle-orm'

import { logger } from '@/logger'

import { db } from './drizzle-db'

export async function clearDatabase() {
  logger.info('Fetching all tables...', { tags: ['DB Cleaner'] })

  const result = await db.execute(
    sql`
			SELECT schemaname, tablename
			FROM pg_tables
			WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
		`,
  )

  logger.info(`Found ${result.length} tables. Disabling foreign key constraints...`, { tags: ['DB Cleaner'] })

  // await db.execute(sql`SET session_replication_role = origin`)

  for(const row of result) {
    const {
      schemaname, tablename, 
    } = row

    if(schemaname !== 'drizzle') {
      logger.debug(`Truncating ${schemaname}.${tablename} table...`, { tags: ['DB Cleaner'] })
      await db.execute(
        sql.raw(`TRUNCATE TABLE "${schemaname}"."${tablename}" RESTART IDENTITY CASCADE`),
      )
    }
  }

  logger.info('Re-enabling foreign key constraints...', { tags: ['DB Cleaner'] })

  // await db.execute(sql`SET session_replication_role = origin`)

  logger.info('Database successfully cleaned.', { tags: ['DB Cleaner'] })
}