import { HttpStatus } from '@/infra/http/http-status'

import { BaseCustomError } from '../base-custom-error'

export class ConflictError extends BaseCustomError {
  constructor(
    message: string,
    description = 'Operação não permitida. Cadastro já existe.',
  ) {
    super(message, description, HttpStatus.Conflict)
  }
}
