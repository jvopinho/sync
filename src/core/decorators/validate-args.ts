import { ZodSchema } from 'zod'

import { ZodCustomError } from '../errors/custom/zod-custom-error'
import { left } from '../errors/either'

export function ValidateArgs(...schemas: [ZodSchema, ...ZodSchema[]]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const datas = [] as any[]

      for(let i = 0; i < schemas.length; i++) {
        const schema = schemas[i]
        const arg = args[i]

        if(schema) {
          const result = schema.safeParse(arg)

          if(!result.success) {
            const parse = schema.safeParse(arg)

            if(!parse.success) {
              console.log(arg)
              return left(new ZodCustomError(parse.error))
            }
          }

          datas.push(result.data)
        } else {
          datas.push(arg)
        }
      }

      return await original.apply(this, datas)
    }

    return descriptor
  }
}