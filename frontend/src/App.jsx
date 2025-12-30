import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import ContactAdmin from './pages/ContactAdmin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/contact-admin" element={<ContactAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
