import { eq } from 'drizzle-orm'

import { db } from '@/infra/database/drizzle/drizzle-db'
import { DrizzleUser } from '@/infra/database/drizzle/schema/tables'

import { dateISO } from '@/utils/date-utils'

import { UserDBO } from '@/modules/user/domain/dbos'
import { UsersRepository } from '@/modules/user/domain/repositories'
import { User } from '@/modules/user/user'

export class DrizzleUsersRepository implements UsersRepository {
  async create(data: SuperOmit<UserDBO, 'created_at'>): Promise<User> {
    const val = await db.insert(DrizzleUser).values({
      ...data,
      created_at: dateISO(),
    }).returning().then(val => val[0])

    return new User(val)
  }

  async findById(id: string): Promise<User | null> {
    const val = await db.select()
      .from(DrizzleUser)
      .where(eq(DrizzleUser.id, id))
      .limit(1)
      .then(val => val[0])

    return val ? new User(val) : null
  }

  async findByUsername(username: string): Promise<User | null> {
    const val = await db.select().from(DrizzleUser).where(eq(DrizzleUser.username, username)).limit(1).then(val => val[0])

    return val ? new User(val) : null
  }

  async updateById(id: string, data: Partial<SuperOmit<UserDBO, 'id'>>): Promise<User> {
    const val = await db
      .update(DrizzleUser)
      .set({ ...data })
      .where(eq(DrizzleUser.id, id))
      .returning().then(val => val[0])

    return new User(val)
  }

  async inactiveById(id: string): Promise<void> {
    await db
      .update(DrizzleUser)
      .set({ status: 'DELETED' })
      .where(eq(DrizzleUser.id, id))
      .returning()
  }

  async deleteById(id: string): Promise<void> {
    await db
      .delete(DrizzleUser)
      .where(eq(DrizzleUser.id, id))
      .returning()
  }
}