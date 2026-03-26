import { UserRole } from '@/@types/enums'
import { env } from '@/env'
import { Base } from '@/modules/base/domain/entities/base'

import { UserDBO } from './domain/dbos'
import { UserBody } from './user.schema'

export type UserRaw = SuperOmit<UserDBO, 'password_hash' | 'ref'> & {
  password_hash: string
}

export class User extends Base {
  public name: string

  public avatarUrl: string

  public readonly role: UserRole = UserRole.COMMON

  public readonly username: string

  public readonly features: string = ''

  private readonly _passwordHash: string | null = null

  constructor(props: Optional<UserRaw, 'password_hash'>) {
    super(props)
    
    if(props.password_hash) {
      this._passwordHash = props.password_hash
    }

    this.username = props.username

    this.update(props)
  }

  update(props: Partial<SuperOmit<UserRaw, 'password_hash'>>): void {
    if(props.name) {
      this.name = props.name
    }

    if(props.avatar_url) {
      this.avatarUrl = props.avatar_url
    }
  }

  getPasswordHash() {
    return this._passwordHash
  }

  get email() {
    return `${this.username}@${env.DOMAIN}`
  }

  toJSON(): UserBody {
    return {
      ...super.toJSON(),
      name: this.name,
      username: this.username,
      email: this.email,
      avatar_url: this.avatarUrl,
      features: this.features.toString(),
      role: this.role,
    }
  }
}