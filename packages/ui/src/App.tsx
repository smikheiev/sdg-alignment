import MainLayout from 'MainLayout'
import { Route, Routes } from 'react-router'

export default function App() {
  return <AppRoutes />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<MainLayout />}>
        <Route path="company">
          <Route path=":companyId" element={<MainLayout />} />
        </Route>
      </Route>
    </Routes>
  )
}
