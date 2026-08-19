import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useAuthStore } from './stores/auth'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'

import { SuperAdminLayout } from './layouts/super-admin/SuperAdminLayout'
import { SuperAdminDashboardPage } from './pages/super-admin/SuperAdminDashboardPage'
import { ManageSaccosPage } from './pages/super-admin/ManageSaccosPage'
import { SaccoDetailsPage } from './pages/super-admin/SaccoDetailsPage'
import { AllUsersPage } from './pages/super-admin/AllUsersPage'
import { PlatformReportsPage } from './pages/super-admin/PlatformReportsPage'
import { PlatformSettingsPage } from './pages/super-admin/PlatformSettingsPage'

import PublicLayout from './components/PublicLayout'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'

const queryClient = new QueryClient()

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  if (isAuthenticated) {
    if (
      user?.role === 'superadmin' ||
      user?.username === 'superadmin' ||
      user?.email === 'superadmin@example.com'
    ) {
      return <Navigate to="/super-admin" replace />
    }
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

            {/* Super Admin Protected Routes */}
            <Route
              path="/super-admin"
              element={
                <ProtectedRoute>
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<SuperAdminDashboardPage />} />
              <Route path="saccos" element={<ManageSaccosPage />} />
              <Route path="saccos/:id" element={<SaccoDetailsPage />} />
              <Route path="users" element={<AllUsersPage />} />
              <Route path="reports" element={<PlatformReportsPage />} />
              <Route path="settings" element={<PlatformSettingsPage />} />
              <Route path="members" element={<ManageSaccosPage />} />
              <Route path="loans" element={<ManageSaccosPage />} />
              <Route path="savings" element={<ManageSaccosPage />} />
              <Route path="accounts" element={<ManageSaccosPage />} />
              <Route path="support" element={<SuperAdminDashboardPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}

