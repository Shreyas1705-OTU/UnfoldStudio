import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ClientDetail from './pages/ClientDetail.jsx'
import ClientForm from './pages/ClientForm.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <Router>
      <div className="app">
        <header className="topbar">
          <Link to="/" className="brand">📷 Client Manager</Link>
        </header>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
