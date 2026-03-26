import {
  varchar, serial, bigint, text, 
} from 'drizzle-orm/pg-core'

import {
  entries, extractKeys, 
} from '@/utils/object-utils'

import { statusEnumPg } from '../enums/status-enum'

export const bitfield = (name: string) => bigint(name, { mode: 'number' }).notNull()

export const commonSchemaFields = {
  id: () => text('id').unique().primaryKey(),
  ref: () => serial('ref').unique(),
  status: () => statusEnumPg('status').notNull().default('ACTIVE'),
  name: (name: string = 'name') => varchar(name, { length: 256 }).notNull(),
  workspace_id: () => text('workspace_id').notNull(),
  created_at: () => varchar('created_at', { length: 27 }).notNull(),
}

type CommonFields = {
  [key in keyof typeof commonSchemaFields]: ReturnType<typeof commonSchemaFields[key]>
}

export const commonFields = {
  ...commonSchemaFields,
  description: () => varchar('description', { length: 2056 }),
  email: () => varchar('email', { length: 256 }).notNull(),

  make<OmitKeys extends keyof CommonFields>({ omit = [] }: { omit: OmitKeys[] } = { omit: [] }): Omit<CommonFields, OmitKeys> {
    let includeFields = [ ...extractKeys(commonSchemaFields) ] as Array<keyof typeof commonSchemaFields>
	
    if(omit && omit.length > 0) {
      includeFields = includeFields.filter(key => !omit.includes(key as OmitKeys))
    }

    return Object.fromEntries(
      entries(commonSchemaFields)
        .filter(([key]) => omit && omit.length > 0 
          ? !omit.includes(key as OmitKeys)
          : true,
        )
        .map(([KeyObject, make]) => ([KeyObject, make()])),
    ) as Omit<CommonFields, OmitKeys>
  },
}