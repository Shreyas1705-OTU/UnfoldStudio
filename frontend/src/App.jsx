import { useState } from 'react'
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import ClientDetail from './pages/ClientDetail.jsx'
import ClientForm from './pages/ClientForm.jsx'
import ClientsSummary from './pages/ClientsSummary.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EventForm from './pages/EventForm.jsx'
import EventsSummary from './pages/EventsSummary.jsx'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <div className="app">
        <header className="topbar">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <Link to="/" className="brand">UnfoldStudio</Link>
        </header>

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/summary" element={<ClientsSummary />} />
            <Route path="/events/new" element={<EventForm />} />
            <Route path="/events/summary" element={<EventsSummary />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
