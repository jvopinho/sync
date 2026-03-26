import z from 'zod'

import { UserBody } from '../../user.schema'

export const CreateUserBody = UserBody.pick({ 
  username: true,
  name: true,
  avatar_url: true,
}).extend({
  password: z.string(),
})
export type CreateUserBody = z.infer<typeof CreateUserBody>