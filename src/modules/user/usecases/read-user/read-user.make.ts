import { DrizzleUsersRepository } from '@/modules/user/infra/repositories'

import { ReadUserUsecase } from './read-user.usecase'

export function makeReadUserUsecase() {
  return new ReadUserUsecase(
    new DrizzleUsersRepository(),
  )
}