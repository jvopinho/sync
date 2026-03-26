import { SignInRoute } from '@/modules/auth/infra/routes/sign-in.route'
import { CreateUserRoute, ReadUserRoute } from '@/modules/user/infra/routes'

import { registerRoute } from '../register-routes'

export const Routes = registerRoute({
  path: '/',
  components: [
    {
      path: '/auth',
      components: [
        SignInRoute,
      ],
    },
    {
      path: '/users',
      components: [
        CreateUserRoute,
        ReadUserRoute,
      ],
    },
  ],
})