import { DrizzleWorkspacesRepository } from '@/database/repositories/drizzle'

import { WorkspaceExistsMiddleware } from './workspace-exists-middleware'

export function makeWorkspaceExistsMiddleware() {
  const middleware = new WorkspaceExistsMiddleware(
    new DrizzleWorkspacesRepository(),
  )

  return middleware.execute.bind(middleware)
}