import process from 'node:process'

import { DrizzleError } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

import { logger } from '@/logger'

import { db } from './drizzle-db'
import { drizzleHelper } from './drizzle-helper'

async function runMigration() {
  logger.info('Migration started...')
  try {
    await migrate(db, { migrationsFolder: './drizzle' })

    logger.info('Migration completed successfully')
  } catch (err) {
    logger.error('Migration failed:')
    console.error(err)
    if(err instanceof DrizzleError) {
      // Handle Drizzle-specific errors
      logger.error('Drizzle-specific error:', { details: err.message })
    }
    throw err
  } finally {
    try {
      await drizzleHelper.disconnect()
    } catch (disconnectError) {
      logger.error('Error during disconnect:')
      logger.error(disconnectError)
    }
  }
}

async function main() {
  try {
    await runMigration()
    process.exit(0)
  } catch (err) {
    logger.error('Unhandled error during migration:')
    logger.error(err)
    process.exit(1)
  }
}

main()
