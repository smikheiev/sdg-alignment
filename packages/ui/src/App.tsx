import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from 'MainLayout'
import { Route, Routes } from 'react-router'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  )
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
