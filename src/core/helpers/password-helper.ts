import { BcryptAdapter } from '@/core/adapters/bcrypt-adapter'

export class PasswordHelper {
  private bcryptAdapter: BcryptAdapter

  constructor(private readonly salt: string | number) {
    this.bcryptAdapter = new BcryptAdapter(salt)
  }

  async compare(storedPassowrdHash: string, proviedPassword: string) {
    return await this.bcryptAdapter.compare(storedPassowrdHash, proviedPassword)
  }

  async encrypt(password: string) {
    return await this.bcryptAdapter.hash(password)
  }
}