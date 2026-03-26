import { uuid } from '@/core/adapters/uuid-adapter'
import { ValidateArgs } from '@/core/decorators/validate-args'
import { UserAlreadyExistsError } from '@/core/errors/custom/client-error'
import { right } from '@/core/errors/either'
import { handleKnownError } from '@/core/errors/handle-know-error'
import { PasswordHelper } from '@/core/helpers/password-helper'

import { UserRole } from '@/@types/enums'
import { Usecase } from '@/@types/usecase'
import { UsersRepository } from '@/modules/user/domain/repositories'

import { CreateUserBody } from './create-user.schema'

export class CreateUserUsecase implements Usecase<CreateUserBody> {
  constructor(
    private passwordHelper: PasswordHelper,
    private usersRepository: UsersRepository,
  ) {}

  @ValidateArgs(CreateUserBody)
  async execute(data: CreateUserBody) {
    const usernameAlreadyExists = await this.usersRepository.findByUsername(data.username)

    if(usernameAlreadyExists) {
      return handleKnownError(
        UserAlreadyExistsError,
        'O nome de usuário fornecido já está em uso.',
        `O nome de usuário fornecido já está em uso (username = ${data.username}).`,
      )
    }

    const passwordHash = await this.passwordHelper.encrypt(data.password)

    const user = await this.usersRepository.create({
      id: uuid(),
      username: data.username,
      features: 0,
      avatar_url: data.avatar_url ?? null,
      name: data.name,
      password_hash: passwordHash,
      role: UserRole.COMMON,
      status: 'ACTIVE',
    })

    return right(user.toJSON())
  }
}