import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

export default function Dashboard() {
  const [clients, setClients] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.listClients().then(setClients).catch((e) => setError(e.message))
  }, [])

  if (error) return <div className="error">Couldn't load clients: {error}</div>
  if (!clients) return <div className="empty">Loading…</div>

  return (
    <div>
      <div className="page-header">
        <h1>Clients</h1>
        <Link to="/clients/new" className="btn btn-primary">+ New Client</Link>
      </div>

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
              <div className={`balance ${c.pending_balance > 0 ? 'balance-due' : 'balance-clear'}`}>
                {c.pending_balance > 0
                  ? `${c.pending_balance.toLocaleString()} pending`
                  : 'Paid off'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
