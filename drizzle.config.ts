import { env } from 'node:process'

import { defineConfig } from 'drizzle-kit'

console.log('-> ', env['POSTGRES_URL'])
export default defineConfig({
  schema: './src/infra/database/drizzle/schema/**/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: env['POSTGRES_URL'] as string },
})