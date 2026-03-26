import { Status } from '@/@types/enums/status'

export interface BaseProps {
  readonly id: string
  
  status: Status
  readonly created_at: string
}

export abstract class Base {
  readonly id: string

  status: Status

  readonly createdAt: string

  constructor(data: BaseProps) {
    this.id = data.id
    this.status = data.status
    this.createdAt = data.created_at
  }

  abstract update(data: {}): void

  toJSON() {
    return {
      id: this.id,
      status: this.status,
      created_at: this.createdAt,
    }
  }
}

export type OmitUnmutableProps<T extends { id: string, status: string, created_at: string }, K extends keyof T> = Omit<T, K | 'id' | 'status' | 'created_at'>