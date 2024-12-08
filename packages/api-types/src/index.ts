import { z } from 'zod'

export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
})
export type Company = z.infer<typeof CompanySchema>

export const GetCompaniesResponseSchema = z.array(CompanySchema)
export type GetCompaniesResponse = z.infer<typeof GetCompaniesResponseSchema>

export const SdgAlignmentStatusSchema = z.enum([
  'strongly_aligned',
  'aligned',
  'misaligned',
  'strongly_misaligned',
])
export type SdgAlignmentStatus = z.infer<typeof SdgAlignmentStatusSchema>

export const SdgAlignmentValueSchema = z.object({
  score: z.number(),
  status: SdgAlignmentStatusSchema,
})
export type SdgAlignmentValue = z.infer<typeof SdgAlignmentValueSchema>

export const SdgAlignmentSchema = z.object({
  sdgId: z.number(),
  alignment: SdgAlignmentValueSchema.nullable(),
})
export type SdgAlignment = z.infer<typeof SdgAlignmentSchema>

export const GetCompanySdgAlignmentResponseSchema = z.object({
  company: CompanySchema,
  sdgAlignments: z.array(SdgAlignmentSchema),
})
export type GetCompanySdgAlignmentResponse = z.infer<
  typeof GetCompanySdgAlignmentResponseSchema
>
