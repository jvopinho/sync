import { SessionHelper } from '@/core/helpers/session-helper'

import { env } from '@/env'
import { makeReadUserUsecase } from '@/modules/user/usecases/read-user'

import { UserMiddleware } from './user-middleware'

export function makeUserMiddleware() {
  const userMiddleware = new UserMiddleware(
    new SessionHelper(
      env.SESSION_JWT_SECRET,
      env.SESSION_JWT_LIVETIME,
    ),
    makeReadUserUsecase(),
  )

  return userMiddleware.execute.bind(userMiddleware)
}

export const userMiddleware = makeUserMiddleware() 