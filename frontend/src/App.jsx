import { HashRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Login from './pages/Login'
import ContactAdmin from './pages/ContactAdmin'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import ServiceConnections from './pages/ServiceConnections'
import Bills from './pages/Bills'
import MeterReadings from './pages/MeterReadings'

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/service-connections" element={<ServiceConnections />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/meter-readings" element={<MeterReadings />} />
      </Routes>
    </HashRouter>
  )
}

export default App