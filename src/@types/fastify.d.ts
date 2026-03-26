import {
  FastifyBaseLogger, 
  FastifyInstance, 
  FastifyRequest, 
  RawReplyDefaultExpression, 
  RawRequestDefaultExpression, 
  RawServerDefault, 
} from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { User } from '@/modules/user/user'
import { UserBody } from '@/modules/user/user.schema'

export type FastifyTypedInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>

export type FastifyTypedRequest<Req extends FastifyRequest = FastifyRequest> = Req & { user: UserBody }

export type FastifyComponent = (app: FastifyTypedInstance) => any

declare module 'fastify' {
  export interface FastifyRequest {
    getUser(): User
  }

  type FastifyInstance = FastifyTypedInstance
}