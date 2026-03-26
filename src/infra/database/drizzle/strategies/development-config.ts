import { env } from '@/env'

import type { DatabaseConfigInterface } from './database-config-interface'

export class DevelopmentConfig implements DatabaseConfigInterface {
  getConnectionString(): string {
    return env.POSTGRES_URL
  }

  getSSLConfig() {
    return undefined
  }
}
