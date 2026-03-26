import { HttpStatus } from '@/infra/http/http-status'

import { BaseCustomError } from '../base-custom-error'

export class BadRequestError extends BaseCustomError {
  constructor(
    message: string,
    description = 'Requisição inválida. Verifique os dados enviados.',
  ) {
    super(message, description, HttpStatus.BadRequest)
  }
}
