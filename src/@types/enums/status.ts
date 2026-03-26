import {
  createEnum, enumInfer, 
} from '@/utils/create-enum'

export const Status = createEnum(['ACTIVE', 'INACTIVE', 'DELETED'])
export type Status = enumInfer<typeof Status>