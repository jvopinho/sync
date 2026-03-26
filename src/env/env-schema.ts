import z from 'zod'

import { zBool } from '@/@types/custom-zod-types'

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production', 'local'])
    .default('local'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().default(3000),
  DEBUG: z.coerce.boolean().default(true),

  DRIZZLE_SQL_LOGGER: zBool(),

  PASSWORD_BCRYPT_SALT: z.coerce.number(),
  SESSION_JWT_SECRET: z.string(),
  SESSION_JWT_LIVETIME: z.coerce.number(),

  POSTGRES_URL: z.string(),

  DOMAIN: z.string(),
})
export type EnvSchema = z.infer<typeof EnvSchema>