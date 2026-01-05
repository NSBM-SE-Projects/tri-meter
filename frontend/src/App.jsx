import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import ContactAdmin from './pages/ContactAdmin'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import ServiceConnections from './pages/ServiceConnections'
import MeterReadings from './pages/MeterReadings'
import Bills from './pages/Bills'
import Tariffs from './pages/Tariffs'
import AccessDenied from './pages/AccessDenied'
import { LoadingOverlay } from "@/components"

function ProtectedRoute({ children, allowedRoles = null }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <LoadingOverlay />
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/access-denied" replace />
  }

  return children
}

function App() {
  return (
    <HashRouter>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={10000}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/contact-admin" element={<ContactAdmin />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        <Route
          path="/dashboard"
          element={
              <Dashboard />
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Field Officer', 'Cashier']}>
              <Customers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/service-connections"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Field Officer']}>
              <ServiceConnections />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meter-readings"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Field Officer']}>
              <MeterReadings />
            </ProtectedRoute>
          }
        />
  
        <Route
          path="/bills"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Cashier']}>
              <Bills />
            </ProtectedRoute>
          }
        />
  
        <Route
          path="/tariffs"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Tariffs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  )
}

export default App