import { z } from 'zod'

import {
  zId, 
  zStatus, 
} from '@/@types/custom-zod-types'

export const BaseBody = z.object({
  id: zId(),
    
  status: zStatus(),
  created_at: z.string(),

  company_id: zId(),
  workspace_id: zId(),
})
