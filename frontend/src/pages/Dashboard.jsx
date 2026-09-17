import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import Calendar from '../components/Calendar.jsx'
import Clock from '../components/Clock.jsx'

export default function Dashboard() {
  const [clients, setClients] = useState(null)
  const [freelanceEvents, setFreelanceEvents] = useState(null)
  const [error, setError] = useState(null)

  const reload = () => {
    api.listClients().then(setClients).catch((e) => setError(e.message))
    api.listFreelanceEvents().then(setFreelanceEvents).catch((e) => setError(e.message))
  }

  useEffect(() => {
    reload()
  }, [])

  const events = useMemo(() => {
    const clientEvents = (clients || [])
      .filter((c) => c.event_date)
      .map((c) => ({ date: c.event_date, label: c.name, type: 'client' }))
    const freelance = (freelanceEvents || [])
      .map((e) => ({ date: e.event_date, label: e.title, type: 'freelance' }))
    return [...clientEvents, ...freelance]
  }, [clients, freelanceEvents])

  const stats = useMemo(() => {
    if (!clients) return null
    const totalPending = clients.reduce((sum, c) => sum + Math.max(c.pending_balance, 0), 0)
    const in30Days = new Date()
    in30Days.setDate(in30Days.getDate() + 30)
    const todayKey = new Date().toISOString().slice(0, 10)
    const upcomingShoots = clients.filter(
      (c) => c.event_date && c.event_date >= todayKey && c.event_date <= in30Days.toISOString().slice(0, 10)
    ).length
    return { total: clients.length, totalPending, upcomingShoots }
  }, [clients])

  const handleDeleteEvent = async (id) => {
    if (!confirm('Remove this freelance event?')) return
    await api.deleteFreelanceEvent(id)
    reload()
  }

  if (error) return <div className="error">Couldn't load dashboard: {error}</div>
  if (!clients || !freelanceEvents) return <div className="empty">Loading…</div>

  return (
    <div>
      <div className="page-header">
        <h1>Studio Overview</h1>
        <div className="header-actions">
          <Link to="/clients/summary" className="btn">Show All</Link>
          <Link to="/events/new" className="btn">+ Add Event</Link>
          <Link to="/clients/new" className="btn btn-primary">+ New Client</Link>
        </div>
      </div>

      <div className="widget-row">
        <Clock />
        <Calendar events={events} />
        <div className="widget stats-widget">
          <div className="stat">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Clients</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.upcomingShoots}</div>
            <div className="stat-label">Shoots in 30 days</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.totalPending.toLocaleString()}</div>
            <div className="stat-label">Pending balance</div>
          </div>
        </div>
      </div>

      <h2 className="section-title">Clients</h2>

      {clients.length === 0 ? (
        <div className="empty">No clients yet. Add your first one.</div>
      ) : (
        <div className="card-grid">
          {clients.map((c) => (
            <Link to={`/clients/${c.id}`} key={c.id} className="client-card">
              <div className="client-card-top">
                <span className="client-name">{c.name}</span>
                <span className="badge">{c.stage}</span>
              </div>
              <div className="client-card-meta">
                {c.event_type || 'No event type'} · {c.event_date || 'No date set'}
              </div>
              <div className="client-card-contact">
                {c.phone && <span>{c.phone}</span>}
                {c.email && <span>{c.email}</span>}
              </div>
              <div className={`balance ${c.pending_balance > 0 ? 'balance-due' : 'balance-clear'}`}>
                {c.pending_balance > 0
                  ? `${c.pending_balance.toLocaleString()} pending`
                  : 'Paid off'}
              </div>
            </Link>
          ))}
        </div>
      )}

      <h2 className="section-title">Freelance Events</h2>

      {freelanceEvents.length === 0 ? (
        <div className="empty">No freelance events logged yet.</div>
      ) : (
        <ul className="entry-list">
          {freelanceEvents.map((e) => (
            <li key={e.id} className="entry entry-row">
              <div>
                <div><span className="calendar-dot calendar-dot-freelance" /> <strong>{e.title}</strong> — {e.event_date}</div>
                {e.location && <div className="entry-meta">{e.location}</div>}
                {e.notes && <div className="entry-meta">{e.notes}</div>}
              </div>
              <button className="btn btn-danger btn-small" onClick={() => handleDeleteEvent(e.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
