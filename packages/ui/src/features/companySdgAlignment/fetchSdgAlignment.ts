import { GetCompanySdgAlignmentResponseSchema } from 'api-types'
import fetchFromServer from 'lib/fetch'

export default async function fetchSdgAlignment(companyId: string | undefined) {
  if (!companyId) {
    return null
  }

  const response = await fetchFromServer(`/company/${companyId}/sdg-alignments`)
  return GetCompanySdgAlignmentResponseSchema.parse(response)
}
