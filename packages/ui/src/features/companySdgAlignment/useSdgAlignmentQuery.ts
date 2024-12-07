import { useQuery } from '@tanstack/react-query'
import fetchSdgAlignment from './fetchSdgAlignment'

export default function useSdgAlignmentQuery(companyId: string | undefined) {
  return useQuery({
    enabled: !!companyId,
    queryKey: ['company', companyId, 'sdgAlignments'],
    queryFn: () => fetchSdgAlignment(companyId),
  })
}
