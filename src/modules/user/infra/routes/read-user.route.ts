import z from 'zod'

import { HttpStatus } from '@/infra/http/http-status'
import { userMiddleware } from '@/infra/http/middlewares/user'
import { registerRoute } from '@/infra/http/register-routes'

import { zId } from '@/@types/custom-zod-types'
import { makeReadUserUsecase } from '@/modules/user/usecases/read-user'
import { UserBody } from '@/modules/user/user.schema'

export const ReadUserRoute = registerRoute(app => {
  app.route({
    url: '/:id',
    method: 'GET',
    schema: {
      operationId: 'readUser',
      description: 'Read a user from the system.',
      tags: ['User'],
      params: z.object({
        id: zId(),
      }),
      response: {
        [HttpStatus.Ok]: UserBody,
      },
    },
    handler: async (request, reply) => {
      const usecase = makeReadUserUsecase()

      const result = (await usecase.execute({
        user_id: request.params.id,
      })).unwrap()

      reply.status(HttpStatus.Ok).send(result.toJSON())
    },
  })

  app.route({
    url: '/@me',
    method: 'GET',
    schema: {
      operationId: 'readCurrentUser',
      description: 'Read a current user',
      tags: ['User'],
      response: {
        [HttpStatus.Ok]: UserBody,
      },
    },
    preHandler: [userMiddleware],
    handler: async (request, reply) => {
      const usecase = makeReadUserUsecase()

      const result = (await usecase.execute({
        user_id: request.getUser().id,
      })).unwrap()

      reply.status(HttpStatus.Ok).send(result.toJSON())
    },
  })
})