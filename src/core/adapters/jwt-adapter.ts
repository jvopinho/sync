import jwt from 'jsonwebtoken'

import { customHttpErrors } from '@/core/errors/codes/custom'
import { Either } from '@/core/errors/either'

interface JwtDecoded {
  user_id: string
  expire_at: number
}

type VerifyResult = Either<{
  name: keyof typeof customHttpErrors, message: string 
}, unknown>

export class JwtAdapter {
  constructor(readonly secret: string) {}

  async sign(
    liveTtime: number,
    payload: Record<string, JSONObject>,
  ): Promise<string> {
    const expireAt = (Math.floor(Date.now() / 1000) + liveTtime)

    const token = await jwt.sign(
      {
        ...payload,
        expire_at: expireAt,
      } as JwtDecoded,
      this.secret,
    )

    return token
  }

  async verify(
    token: string,
  ) {
    return await jwt.verify(token.replace(/^Bearer\s+/, ''), this.secret)
  }
}
