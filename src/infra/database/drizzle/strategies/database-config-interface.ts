export interface DatabaseConfigInterface {
  getConnectionString(): string
  getSSLConfig(): { ssl: { ca: string | string[] } } | undefined
}
