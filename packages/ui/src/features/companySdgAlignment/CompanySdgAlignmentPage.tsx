import { useParams } from 'react-router'

export default function CompanySdgAlignmentPage() {
  const { companyId } = useParams()

  if (!companyId) {
    return <h2>Select a company</h2>
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">{companyId}</h2>
      <p>More details coming soon...</p>
    </div>
  )
}
