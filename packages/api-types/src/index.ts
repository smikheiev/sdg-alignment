import { z } from 'zod'

export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
})
export type Company = z.infer<typeof CompanySchema>

export const GetCompaniesResponseSchema = z.array(CompanySchema)
export type GetCompaniesResponse = z.infer<typeof GetCompaniesResponseSchema>
