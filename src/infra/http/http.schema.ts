import z from 'zod'

import { zId } from '@/@types/custom-zod-types'

export const basicHeaders = z.object({
  authorization: z.string(),
})

export const companyIdParam = {
  company_id: zId(),
}

export const workspaceIdParam = {
  workspace_id: zId(),
}