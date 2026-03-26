import {
  createEnum, enumInfer, 
} from '@/utils/create-enum'

export const UserRole = createEnum([
  'COMMON',
  'ADMIN',
])
export type UserRole = enumInfer<typeof UserRole>