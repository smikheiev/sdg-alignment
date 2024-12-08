import { useParams } from 'react-router'
import CompaniesList from './CompaniesList'
import useCompaniesQuery from './useCompaniesQuery'

export default function CompaniesListPage() {
  const queryResult = useCompaniesQuery()
  const { companyId: selectedCompanyId } = useParams()

  if (queryResult.status === 'pending') {
    return <h2>Loading...</h2>
  }

  if (queryResult.status === 'error') {
    return <h2>Error</h2>
  }

  return (
    <CompaniesList
      companies={queryResult.data}
      selectedCompanyId={selectedCompanyId}
    />
  )
}
