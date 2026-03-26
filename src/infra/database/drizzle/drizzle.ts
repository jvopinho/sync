import { Logger } from '../../logger'

export class DrizzleLogger {
  constructor(private logger: Logger) {}

  logQuery(query: string, params: unknown[]): void {
    this.logger.debug(`Drizzle Query: ${query}${params.length > 0 ? ` | Params: ${params.map((x, i) => `$${i + 1} ${x}`).join(' | ')}` : ''}`, {
      tags: ['Drizzle'],
    })
  }

  logError(error: unknown): void {
    this.logger.error(`Drizzle Error: ${error}`, {
      tags: ['Drizzle'],
    })
  }

  logInfo(message: string): void {
    this.logger.info(`Drizzle Info: ${message}`, {
      tags: ['Drizzle'],
    })
  }
}