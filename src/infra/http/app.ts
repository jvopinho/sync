
import { fastifyCors } from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { ZodError } from 'zod'

import { BaseCustomError } from '@/core/errors/custom/base-custom-error'
import { ZodCustomError } from '@/core/errors/custom/zod-custom-error'

import { consoleDev } from '@/utils/dev-utils'

import { env } from '@/env'
import { logger } from '@/logger'

import { Routes } from './routes/index.route'
import { swagger as fastifySwagger } from './swagger'

export const app = fastify({
  logger: false,
})

// Logger
app.addHook('onRequest', (request, reply, done) => {
  logger.info(`⏪ ${request.method} ${request.url}`, { tags: ['Http Request'] })
  done()
})

app.addHook('onResponse', (request, reply, done) => {
  logger.info(`⏩ ${request.method} ${request.url} - ${reply.statusCode}`, { tags: ['Http Response'] })
  done()
})

// Cors
app.register(fastifyCors, { origin: '*' })

// Plugins
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.register(fastifySwagger)
app.register(fastifyJwt, {
  secret: env.SESSION_JWT_SECRET,
})

// Decorators

// Register Routes
app.setErrorHandler((error, request, reply) => {
  if(error instanceof BaseCustomError) {
    logger.error(`${error.statusCode} - ${error.message}`, {
      tags: 'Http Error Handler',
      details: error.description.toValue() as object,
    })

    return reply.status(error.statusCode).send({
      message: error.message,
      description: error.description.toValue(),
      tag: error.tag,
    })
  }

  if(error instanceof ZodError) {
    const zodCustomError = new ZodCustomError(error)

    return reply.status(zodCustomError.statusCode).send({
      message: zodCustomError.message,
      description: zodCustomError.description.toValue(),
      tag: zodCustomError.tag,
    })
  }

  consoleDev(error)
  reply.status((error as { statusCode: number }).statusCode ?? 500).send({ message: (error as Error).message })
})

app.register(Routes, { prefix: '/' })

const { signal } = new AbortController()

export async function listenApp() {
  app.listen(
    {
      port: env.PORT,
      host: env.HOST,
      exclusive: false,
      signal,
    },
    (error, address) => {
      if(error) {
        logger.fatal(error)
      } else {
        logger.info(`Http Server is running on port ${env.PORT} (${address})`, { tags: 'Http Server' })
      }
    },
  )
}