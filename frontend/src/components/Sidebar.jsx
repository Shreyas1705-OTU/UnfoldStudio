import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

export default function Sidebar({ open, onClose }) {
  const [nextShoot, setNextShoot] = useState(undefined)

  useEffect(() => {
    if (!open) return
    api.listClients().then((clients) => {
      const todayKey = new Date().toISOString().slice(0, 10)
      const upcoming = clients
        .filter((c) => c.event_date && c.event_date >= todayKey)
        .sort((a, b) => a.event_date.localeCompare(b.event_date))
      setNextShoot(upcoming[0] || null)
    }).catch(() => setNextShoot(null))
  }, [open])

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'sidebar-overlay-open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Menu</span>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">✕</button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/clients/summary" className="sidebar-link" onClick={onClose}>
            📋 Clients Summary
          </Link>
          <Link to="/events/summary" className="sidebar-link" onClick={onClose}>
            📋 Events Summary
          </Link>
        </nav>

        <div className="upcoming-box">
          <div className="upcoming-box-title">Next Upcoming Shoot</div>
          {nextShoot === undefined && <div className="empty">Loading…</div>}
          {nextShoot === null && <div className="empty">No upcoming shoots scheduled</div>}
          {nextShoot && (
            <div className="upcoming-box-body">
              <div className="upcoming-box-name">{nextShoot.name}</div>
              <div className="upcoming-box-row">{nextShoot.event_type || 'No event type'}</div>
              <div className="upcoming-box-row">{nextShoot.event_date}</div>
              <div className="upcoming-box-row"><span className="badge">{nextShoot.stage}</span></div>
              <Link to={`/clients/${nextShoot.id}`} className="btn btn-small" onClick={onClose}>
                View client
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
