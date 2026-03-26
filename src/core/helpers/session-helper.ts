import { JwtAdapter } from '@/core/adapters/jwt-adapter'
import { customHttpErrors } from '@/core/errors/codes/custom'
import { Either, left, right } from '@/core/errors/either'

export interface SessionJwt {
  sub: string
  expire_at: number
}

type VerifyResult = Either<{ name: keyof typeof customHttpErrors, message: string }, SessionJwt>

export class SessionHelper {
  private jwtAdapter: JwtAdapter

  constructor(readonly jwtSecret: string, private readonly liveTtime: number) {
    this.jwtAdapter = new JwtAdapter(jwtSecret)
  }

  async verifyJwt(jwt: string): Promise<VerifyResult> {
    try {
      const decodedToken = await this.jwtAdapter.verify(jwt) as SessionJwt
            
      if(new Date(decodedToken.expire_at * 1000).getTime() < Date.now()) {
        return left({
          name: 'JwtAuthExpired',
          message: customHttpErrors.JwtAuthExpired,
        })
      }

      return right(decodedToken)
    } catch (e) {
      return left({
        name: 'JwtAuthExpired',
        message: customHttpErrors.JwtAuthInvalid,
      })
    }
  }

  async generateJwt(data: SuperOmit<SessionJwt, 'expire_at'>) {
    return await this.jwtAdapter.sign(this.liveTtime, { ...data })
  }
}