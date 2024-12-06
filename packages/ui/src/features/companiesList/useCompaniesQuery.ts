import { useQuery } from '@tanstack/react-query'
import fetchCompanies from './fetchCompanies'

export default function useCompaniesQuery() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  })
}
