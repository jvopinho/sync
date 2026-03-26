import { User } from '@/modules/user/user'

import { UserDBO } from '../dbos'

export interface UsersRepository {
  create(data: SuperOmit<UserDBO, 'ref' | 'created_at'>): Promise<User>
  findById(id: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  updateById(id: string, data: Partial<SuperOmit<UserDBO, 'id'>>): Promise<User>
  inactiveById(id: string): Promise<void>
  deleteById(id: string): Promise<void>
}