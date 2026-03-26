import z from 'zod'

import { registerRoute } from '@/infra/http/register-routes'

import { zId } from '@/@types/custom-zod-types'

import { makeSignInUsecase, SignInBody } from '../../usecases/sign-in'

export const SignInRoute = registerRoute(app => {
  app.route({
    url: '/sign-in',
    method: 'POST',
    schema: {
      operationId: 'signInUser',
      tags: ['auth'],
      description: 'Sign in a user and return a JWT token',
      body: SignInBody,
      response: {
        200: z.object({
          access_token: z.string(),
          user_id: zId(),
        }),
      },
    },
    async handler(request, reply) {
      const usecase = makeSignInUsecase()
      const { sign_in_key, password } = request.body

      const data = (await usecase.execute({ sign_in_key, password })).unwrap()

      reply.send(data)
    },
  })
})