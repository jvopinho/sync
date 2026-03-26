import { UserFeaturesMiddleware } from './user-features-middleware'

export function makeUserFeaturesMiddleware(
  ...args: ConstructorParameters<typeof UserFeaturesMiddleware>
) {
  const middleware = new UserFeaturesMiddleware(...args)

  return middleware.execute.bind(middleware)
}