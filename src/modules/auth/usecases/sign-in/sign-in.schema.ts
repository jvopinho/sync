import z from 'zod'

export const SignInBody = z.object({
  sign_in_key: z.string(),
  password: z.string(),
})
export type SignInBody = z.infer<typeof SignInBody>