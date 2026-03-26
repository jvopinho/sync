
import { ValidateArgs } from '@/core/decorators/validate-args'
import { NotFoundError, PasswordMismatchError, UserBlockedForLoginError } from '@/core/errors/custom/client-error'
import { ZodCustomError } from '@/core/errors/custom/zod-custom-error'
import { Either, right } from '@/core/errors/either'
import { handleKnownError } from '@/core/errors/handle-know-error'
import { PasswordHelper } from '@/core/helpers/password-helper'
import { SessionHelper } from '@/core/helpers/session-helper'

import { Status } from '@/@types/enums/status'
import { Usecase } from '@/@types/usecase'
import { env } from '@/env'
import { UsersRepository } from '@/modules/user/domain/repositories'

import { SignInBody } from './sign-in.schema'

export type SignInResponse = Either<
  ZodCustomError | NotFoundError | PasswordMismatchError | UserBlockedForLoginError,
  { access_token: string, user_id: string }
>

const emailRegex = new RegExp(`${`@${env.DOMAIN}`.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i')

export class SignInUseCase implements Usecase<SignInBody> {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHelper: PasswordHelper,
    private sessionHelper: SessionHelper,
  ) {}

  @ValidateArgs(SignInBody)
  async execute(data: SignInBody): Promise<SignInResponse> {
    const username = emailRegex.test(data.sign_in_key) ? data.sign_in_key.replace(emailRegex, '') : data.sign_in_key
    const user = await this.usersRepository.findByUsername(data.sign_in_key)

    if(!user || user.status === Status.DELETED) {
      return handleKnownError(
        NotFoundError,
        'Usuário não encontrado.',
        `Nenhum usuário encontrado com o nome de usuário fornecido (username = ${username}).`,
      )
    }

    if(user.status === Status.INACTIVE) {
      return handleKnownError(
        UserBlockedForLoginError,
        'Usuário bloqueado para login.',
        `O usuário está bloqueado para login (username = ${username}).`,
      )
    }

    if(!user.getPasswordHash()) {
      return handleKnownError(
        NotFoundError,
        'Usuário não encontrado.',
        `Nenhum usuário encontrado com o nome de usuário fornecido (username = ${username}).`,
      )
    }

    const passwordMatch = this.passwordHelper.compare(user.getPasswordHash() as string, data.password)

    if(!passwordMatch) {
      return handleKnownError(
        PasswordMismatchError,
        'Usuário ou Senha incorretos!',
        'A senha fornecida pelo usuário não é igual à senha registrada no banco de dados.',
      )
    }

    const jwt = await this.sessionHelper.generateJwt({ sub: user.id })

    return right({
      user_id: user.id,
      access_token: jwt,
    })
  }
}