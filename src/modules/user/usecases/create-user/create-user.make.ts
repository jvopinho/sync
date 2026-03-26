import { PasswordHelper } from '@/core/helpers/password-helper'

import { env } from '@/env'
import { DrizzleUsersRepository } from '@/modules/user/infra/repositories'

import { CreateUserUsecase } from './create-user.usecase'

export function makeCreateUserUsecase() {
  return new CreateUserUsecase(
    new PasswordHelper(env.PASSWORD_BCRYPT_SALT),
    new DrizzleUsersRepository(),
  )
}