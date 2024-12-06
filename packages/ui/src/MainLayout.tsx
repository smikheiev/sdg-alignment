import CompaniesListPage from 'features/companiesList/CompaniesListPage'
import CompanySdgAlignmentPage from 'features/companySdgAlignment/CompanySdgAlignmentPage'

export default function MainLayout() {
  return (
    <div className="flex h-screen gap-3 p-8">
      <div className="w-60 overflow-y-auto rounded-lg bg-gray-50 p-4">
        <CompaniesListPage />
      </div>

      <div className="flex-1 rounded-lg bg-gray-50 p-4">
        <CompanySdgAlignmentPage />
      </div>
    </div>
  )
}
