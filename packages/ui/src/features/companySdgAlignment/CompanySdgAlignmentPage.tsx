import { useParams } from 'react-router'
import useSdgAlignmentQuery from './useSdgAlignmentQuery'
import SdgAlignmentsChart from './SdgAlignmentsChart'

export default function CompanySdgAlignmentPage() {
  const { companyId } = useParams()
  const queryResult = useSdgAlignmentQuery(companyId)

  if (!companyId) {
    return <h2>Select a company</h2>
  }

  if (queryResult.status === 'pending') {
    return <h2>Loading...</h2>
  }

  if (queryResult.status === 'error') {
    return <h2>Error</h2>
  }

  if (!queryResult.data) {
    return <h2>No data found</h2>
  }

  return (
    <div className="flex-col">
      <h2 className="text-2xl font-semibold">
        {queryResult.data.company.name}
      </h2>
      <div className="w-full h-96 mt-8">
        <SdgAlignmentsChart sdgAlignments={queryResult.data.sdgAlignments} />
      </div>
    </div>
  )
}
