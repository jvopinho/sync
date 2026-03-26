import { FastifyReply, FastifyRequest } from 'fastify'

import { BadRequestError, NotFoundError } from '@/core/errors/custom/client-error'
import { handleKnownError } from '@/core/errors/handle-know-error'

import { WorkspacesRepository } from '@/database/repositories'

export class WorkspaceExistsMiddleware {
  constructor(
    private readonly workspacesRepository: WorkspacesRepository,
  ) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const { company_id, workspace_id } = (request.params as Record<string, string>)

    if(!workspace_id) {
      return handleKnownError(
        BadRequestError,
        'workspace_id não foi fornecido nos parâmetros da requisição',
      ).throw()
    }

    const workspace = await this.workspacesRepository.findById(workspace_id)

    if(!workspace) {
      return handleKnownError(
        NotFoundError,
        'Workspace não encontrada',
        'O identificador fornecido pelo usuário não foi encontrado no banco de dados',
      ).throw()
    }

    if(workspace.companyId !== company_id) {
      return handleKnownError(
        NotFoundError,
        'Workspace não encontrado',
        'O identificador fornecido pelo usuário é pertencente a outra company',
      ).throw()
    }
  }
}