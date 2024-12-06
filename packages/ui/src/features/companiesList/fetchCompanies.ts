import { GetCompaniesResponseSchema } from 'api-types'
import fetchFromServer from 'lib/fetch'

export default async function fetchCompanies() {
  const response = await fetchFromServer('/companies')
  return GetCompaniesResponseSchema.parse(response)
}
