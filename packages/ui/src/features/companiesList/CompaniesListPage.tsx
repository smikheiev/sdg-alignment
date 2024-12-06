import { useParams } from 'react-router'
import CompaniesList from './CompaniesList'
import { companies } from './companiesMock'

export default function CompaniesListPage() {
  const { companyId: selectedCompanyId } = useParams()

  return (
    <CompaniesList
      companies={companies}
      selectedCompanyId={selectedCompanyId}
    />
  )
}
