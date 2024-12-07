import { useParams } from 'react-router'
import SdgAlignmentsChart from './SdgAlignmentsChart'
import { sdgAlignments } from './sdgAlignmentsMock'

export default function CompanySdgAlignmentPage() {
  const { companyId } = useParams()

  if (!companyId) {
    return <h2>Select a company</h2>
  }

  return (
    <div className="flex-col">
      <h2 className="text-2xl font-semibold">{companyId}</h2>
      <div className="w-full h-96 mt-8">
        <SdgAlignmentsChart sdgAlignments={sdgAlignments} />
      </div>
    </div>
  )
}
