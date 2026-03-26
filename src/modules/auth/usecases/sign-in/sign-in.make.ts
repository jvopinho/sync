import { PasswordHelper } from '@/core/helpers/password-helper'
import { SessionHelper } from '@/core/helpers/session-helper'

import { env } from '@/env'
import { DrizzleUsersRepository } from '@/modules/user/infra/repositories'

import { SignInUseCase } from './sign-in.usecase'

export function makeSignInUsecase() {
  return new SignInUseCase(
    new DrizzleUsersRepository(),
    new PasswordHelper(env.PASSWORD_BCRYPT_SALT),
    new SessionHelper(env.SESSION_JWT_SECRET, env.SESSION_JWT_LIVETIME),
  )
}