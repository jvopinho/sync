import z from 'zod'

export const ReadUserBody = z.object({
  user_id: z.string(),
})
export type ReadUserBody = z.infer<typeof ReadUserBody>