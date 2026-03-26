import { UserFeatures } from '@sypos/flags'
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'

import { ForbiddenError } from '@/core/errors/custom/client-error'
import { handleKnownError } from '@/core/errors/handle-know-error'

import { User } from '@/modules/user/user'

export class UserFeaturesMiddleware {
  readonly flags: Parameters<UserFeatures['resolve']>[0]

  constructor(...flags: Parameters<UserFeatures['resolve']>) {
    this.flags = UserFeatures.resolve(...flags)
  }

  execute(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    const user = request.getUser() as User

    const userFeatures = new UserFeatures(BigInt(user.features))

    if(!userFeatures.has(this.flags)) {
      return handleKnownError(
        ForbiddenError,
        'O usuário não possui recursos necessários para está ação',
        'Recursos faltando',
      ).throw()
    }

    done()
  }
}