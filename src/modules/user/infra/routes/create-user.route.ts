import { HttpStatus } from '@/infra/http/http-status'
import { registerRoute } from '@/infra/http/register-routes'

import { CreateUserBody, makeCreateUserUsecase } from '../../usecases/create-user'
import { UserBody } from '../../user.schema'

export const CreateUserRoute = registerRoute(app => {
  app.route({
    url: '/',
    method: 'POST',
    schema: {
      operationId: 'createUser',
      description: 'Create a new user in the system.',
      tags: ['User'],
      body: CreateUserBody,
      response: {
        [HttpStatus.Created]: UserBody,
      },
    },
    handler: async (request, reply) => {
      const usecase = makeCreateUserUsecase()

      const result = (await usecase.execute(request.body)).unwrap()

      reply.status(HttpStatus.Created).send(result)
    },
  })
})