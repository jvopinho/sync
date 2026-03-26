import { FastifyReply, FastifyRequest } from 'fastify'

import { customHttpErrors } from '@/core/errors/codes/custom'
import { UnauthorizedError } from '@/core/errors/custom/client-error'
import { handleKnownError } from '@/core/errors/handle-know-error'
import { SessionHelper } from '@/core/helpers/session-helper'

import { ReadUserUsecase } from '@/modules/user/usecases/read-user'

export class UserMiddleware {
  constructor(
    private readonly sessionHelper: SessionHelper,
    private readonly readUserUsecase: ReadUserUsecase, 
  ) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const authorization = request.headers['authorization']

    if(!authorization) {
      return handleKnownError(
        UnauthorizedError,
        customHttpErrors.JwtNotProvied,
      ).throw()
    }

    const jwtResult = await this.sessionHelper.verifyJwt(authorization)

    if(jwtResult.isLeft()) {
      return handleKnownError(
        UnauthorizedError,
        jwtResult.value.message,
        jwtResult.value.name as string,
      ).throw()
    }

    const jwt = jwtResult.value

    const readRserResult = await this.readUserUsecase.execute({ user_id: jwt.sub })

    if(readRserResult.isLeft()) {
      return readRserResult.throw()
    }

    const user = readRserResult.value

    request.getUser = () => user
  }
}