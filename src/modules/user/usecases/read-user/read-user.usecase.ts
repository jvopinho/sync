import { ValidateArgs } from '@/core/decorators/validate-args'
import { NotFoundError } from '@/core/errors/custom/client-error'
import { ZodCustomError } from '@/core/errors/custom/zod-custom-error'
import { Either, right } from '@/core/errors/either'
import { handleKnownError } from '@/core/errors/handle-know-error'

import { Usecase } from '@/@types/usecase'
import { UsersRepository } from '@/modules/user/domain/repositories'

import { User } from '../../user'
import { ReadUserBody } from './read-user.schema'

export type ReadUserResult = Either<
  ZodCustomError | NotFoundError,
  User
>

export class ReadUserUsecase implements Usecase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  @ValidateArgs(ReadUserBody)
  async execute({ user_id: userId }: ReadUserBody): Promise<ReadUserResult> {
    const user = await this.usersRepository.findById(userId)

    if(!user) {
      return handleKnownError(
        NotFoundError,
        'Usuário não encontrado',
        'O identificador fornecido pelo usuário não foi encontrado no banco de dados',
      )
    }

    return right(user)
  }
}