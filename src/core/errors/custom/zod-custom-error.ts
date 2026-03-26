import type { ZodError } from 'zod'

import { BaseCustomError } from './base-custom-error'

type ZodIssue = ZodError['issues'][number]

export class ZodCustomError extends BaseCustomError {
  constructor(description: ZodError) {
    const firstIssue = ZodCustomError.extractFirstIssue(description)

    super(
      '',
      `[${firstIssue.path.join('.')}] - ${firstIssue.message}`,
      400,
    )
  }

  private static extractFirstIssue(error: ZodError): ZodIssue {
    if(error.issues.length > 0 && error.issues[0].code !== 'invalid_union') {
      return error.issues[0]
    }

    const unionErrors = (error.issues[0] as any).unionErrors

    for(const unionError of unionErrors) {
      if(unionError.errors.length > 0) {
        return unionError.errors[0]
      }
    }

    return {
      code: 'custom',
      path: [],
      message: 'Unknown validation error',
    } as ZodIssue
  }
}