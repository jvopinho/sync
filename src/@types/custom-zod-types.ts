import { z } from 'zod'

import { extractKeys } from '@/utils/object-utils'

import { Status } from './enums/status'
import { UserRole } from './enums/user-role'

type RawCreateParams = z.core.$ZodStringParams

type ZodEnumArgs<T> = [T, ...T[]]
export const makeZEnum = <T extends string>(keys: T[]) => (params?: z.core.$ZodEnumParams) => z.enum(keys as ZodEnumArgs<T>, params)

export const zId = (params?: z.core.$ZodUUIDParams) => z.uuid()
export const zRef = z.string
export const zBool = (params?: z.core.$ZodEnumParams) => z.enum(['true', 'false'], params)
  .transform((a) => a === 'true')
  .default(false)

export const zBitfield = (params?: RawCreateParams) => z.string(params).regex(/^\d+$/)

export const zStatus = makeZEnum(extractKeys(Status))
export const zUserRole = makeZEnum(extractKeys(UserRole))

export const zThumbnailAssetColor = (params?: RawCreateParams) => z.string(params).regex(/^color:\/\/#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)
export const zThumbnailUrl = (params?: RawCreateParams) => z.url()
