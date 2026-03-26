// import { ca } from 'aws-ssl-profiles'

// import { env } from '@/env'

// import type { DatabaseConfigInterface } from './database-config-interface'

// export class ProductionConfig implements DatabaseConfigInterface {
// 	getConnectionString(): string {
// 		return env.POSTGRES_URL
// 	}

// 	getSSLConfig() {
// 		return {
// 			ssl: {
// 				ca,
// 			},
// 		}
// 	}
// }

import { env } from '@/env'

import type { DatabaseConfigInterface } from './database-config-interface'

export class ProductionConfig implements DatabaseConfigInterface {
  getConnectionString(): string {
    return env.POSTGRES_URL
  }

  getSSLConfig() {
    return undefined
  }
}
