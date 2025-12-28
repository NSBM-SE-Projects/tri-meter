import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import DashboardLayout from '@/components/layout/dashboard-layout'
import LoginPage from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Electricity from '@/pages/Electricity'
import Water from '@/pages/Water'
import Gas from '@/pages/Gas'
import Billing from '@/pages/Billing'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'

export function AppRouter() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="electricity" element={<Electricity />} />
        <Route path="water" element={<Water />} />
        <Route path="gas" element={<Gas />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
