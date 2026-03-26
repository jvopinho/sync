import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import {
  debug, env, isDevelopment, isProduction, 
} from '@/env'
import { logger } from '@/logger'

import { DrizzleLogger } from './drizzle'
import { schemas } from './mount-schema'
import {
  type DatabaseConfigInterface,
  DevelopmentConfig,
  LocalConfig,
  ProductionConfig,
} from './strategies'

type DrizzleDatabase = ReturnType<typeof drizzle<typeof schemas>>

class DrizzleHelper {
  private static instance: DrizzleHelper

  private db: DrizzleDatabase | null = null

  private pgClient: postgres.Sql | null = null

  private config: DatabaseConfigInterface

  private connecting: Promise<boolean> | null = null

  private constructor() {
    if(isProduction) {
      this.config = new ProductionConfig()
    } else if(isDevelopment) {
      this.config = new DevelopmentConfig()
    } else {
      this.config = new LocalConfig()
    }
  }

  getConnectionConfig(): string {
    return this.config.getConnectionString()
  }

  static getInstance(): DrizzleHelper {
    if(!DrizzleHelper.instance) {
      DrizzleHelper.instance = new DrizzleHelper()
    }
    return DrizzleHelper.instance
  }

  async disconnect(): Promise<void> {
    if(this.connecting) {
      await this.connecting
    }

    if(this.pgClient) {
      await this.pgClient.end({ timeout: 5 })
      this.db = null
      this.pgClient = null
      logger.info('PostgreSQL disconnected')
    }
  }

  getDatabase(): DrizzleDatabase {
    if(!this.db) {
      const poolConfig = {
        max: 10, // Número máximo de conexões no pool
        idle_timeout: 20, // Tempo em segundos para fechar conexões ociosas
        connect_timeout: 10, // Tempo limite de conexão em segundos
      }

      this.pgClient = postgres(this.config.getConnectionString(), {
        ...this.config.getSSLConfig(),
        ...poolConfig,
        onnotice: () => {}, // Ignorar notices para reduzir logs
      // debug: debug ? console.log : false
      })
    
      this.db = drizzle(this.pgClient as postgres.Sql, {
        schema: schemas,
        logger: env.DRIZZLE_SQL_LOGGER ? new DrizzleLogger(logger) : false,
      })

      this.db.execute(sql`SELECT 1`).then(() => {
        logger.info(
          `Connected to ${isProduction || isDevelopment ? 'Cloud' : 'Local'} PostgreSQL (pool max: ${poolConfig.max})`,
        )
      })
    
      if(!this.db) {
        throw new Error('Failed to connect to the database.')
      }
    }
    return this.db
  }

  async getPoolStatus(): Promise<any> {
    if(!this.pgClient) {
      return {
        active: 0, idle: 0, waiting: 0, status: 'not connected', 
      }
    }

    try {
      // Esta consulta retorna informações sobre conexões do PostgreSQL
      const result = await this.pgClient`
				SELECT count(*) as count, state 
				FROM pg_stat_activity 
				WHERE application_name = current_setting('application_name')
				GROUP BY state
			`

      return result
    } catch (error) {
      if(debug) {
        logger.error('Error querying pool status:')
        logger.error(error)
      }
			
      return { error: 'Unable to query pool status' }
    }
  }
}

export const drizzleHelper = DrizzleHelper.getInstance()

export async function getDb(): Promise<DrizzleDatabase> {
  return drizzleHelper.getDatabase()
}

export function getConnectionConfig(): string {
  return drizzleHelper.getConnectionConfig()
}
