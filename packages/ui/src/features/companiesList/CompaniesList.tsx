import { Company } from 'api-types'
import { Link } from 'react-router'

type Props = {
  companies: Company[]
  selectedCompanyId?: string
}

export default function CompaniesList(props: Props) {
  return (
    <ul className="space-y-2">
      {props.companies.map((company) => (
        <li key={company.id}>
          <Link
            className={`flex rounded-lg p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-900 ${
              company.id === props.selectedCompanyId
                ? 'bg-blue-100 font-semibold text-blue-900'
                : ''
            }`}
            to={`/company/${company.id}`}
          >
            {company.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
