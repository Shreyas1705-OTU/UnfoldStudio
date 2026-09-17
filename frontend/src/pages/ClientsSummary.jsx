import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'event_type', label: 'Event Type' },
  { key: 'event_date', label: 'Event Date' },
  { key: 'stage', label: 'Stage' },
  { key: 'total_package', label: 'Total Package' },
  { key: 'pending_balance', label: 'Pending Balance' },
  { key: 'created_at', label: 'Client Since' },
]

export default function ClientsSummary() {
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
        <h1>Clients Summary</h1>
        <Link to="/" className="btn">← Back to Dashboard</Link>
      </div>

      {clients.length === 0 ? (
        <div className="empty">No clients yet.</div>
      ) : (
        <div className="sheet-wrap">
          <table className="sheet">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>
                    <Link to={`/clients/${c.id}`}>{c.name}</Link>
                  </td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.email || '—'}</td>
                  <td>{c.instagram || '—'}</td>
                  <td>{c.event_type || '—'}</td>
                  <td>{c.event_date || '—'}</td>
                  <td><span className="badge">{c.stage}</span></td>
                  <td>{c.total_package ?? '—'}</td>
                  <td className={c.pending_balance > 0 ? 'balance-due' : 'balance-clear'}>
                    {c.pending_balance}
                  </td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
