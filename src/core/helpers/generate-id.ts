import { uuid } from '../adapters/uuid-adapter'

export const generateId = () => {
  return uuid()
}