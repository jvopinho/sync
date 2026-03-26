import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastifyPlugin from 'fastify-plugin'
import { 
  validatorCompiler,
  serializerCompiler,
  createJsonSchemaTransformObject,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import z from 'zod'

import { version } from '@/../package.json'
import { zStatus } from '@/@types/custom-zod-types'
import { FastifyComponent } from '@/@types/fastify'
import { UserBody } from '@/modules/user/user.schema'

const urlClear = (url: string) => {
  if(url.endsWith('/') && url !== '/') {
    return url.replace(/\/$/, '')
  }

  return url
}

const swaggerSchemaRegistry = z.registry<{
  id?: string
  title?: string
  description?: string
  example?: string
}>()

export const swagger: FastifyComponent = fastifyPlugin((app) => {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Sync API',
        version,
      },
      tags: [
        {
          name: 'user', description: 'User related end-points',
        },
        {
          name: 'workspace', description: 'Workspace related end-points',
        },
      ],
    },

    transformObject: (...args: Parameters<ReturnType<typeof createJsonSchemaTransformObject>>) => {
      const callback = createJsonSchemaTransformObject({ schemaRegistry: swaggerSchemaRegistry })

      const result = callback(...args);

      (result as any).components.schemas = Object.fromEntries(
        Object.entries((result as any).components.schemas).map(([name, value]) => !name.endsWith('Input') ? ([name, value]) : undefined).filter(x => x !== undefined),
      )

      return result
    },

    transform(documentObject) {
      documentObject.url = urlClear(documentObject.url)
      documentObject.route.url = urlClear(documentObject.route.url)

      return jsonSchemaTransform(documentObject)
    },
  })

  app.register(fastifySwaggerUi, { routePrefix: '/docs' })
})

// Register Schemas
const schemas = {
  Status: zStatus(),

  User: UserBody,
} satisfies Record<string, z.ZodSchema>

for(const [name, schema] of Object.entries(schemas)) {
  swaggerSchemaRegistry.add(schema, { id: name })
}