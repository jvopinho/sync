import path from 'node:path'

import { FastifyComponent, FastifyTypedInstance } from '@/@types/fastify'

interface RegisterRoutes {
  path: string
  components: Array<FastifyComponent | RegisterRoutes>
}

export function registerRoute(arg: RegisterRoutes[] | RegisterRoutes | FastifyComponent): FastifyComponent {
  const register = (app: FastifyTypedInstance, baseUrl: string, route: RegisterRoutes) => {
    console.log(route, baseUrl)
    route.components.map(component => {
      if(typeof component === 'function') {
        app.register(component, { prefix: baseUrl })
      } else {
        register(app, path.join(baseUrl, component.path), component)
      }
    })
  }

  return app => {
    if(Array.isArray(arg)) {
      arg.map(route => {
        register(app, route.path, route)
      })
    } else if(typeof arg === 'function') {
      app.register(arg, { prefix: '/' })
    } else {
      register(app, (arg as RegisterRoutes).path, arg as RegisterRoutes)
    }
  }
}