import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

export default function EventsSummary() {
  const [events, setEvents] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.listFreelanceEvents().then(setEvents).catch((e) => setError(e.message))
  }, [])

  if (error) return <div className="error">Couldn't load events: {error}</div>
  if (!events) return <div className="empty">Loading…</div>

  return (
    <div>
      <div className="page-header">
        <h1>Events Summary</h1>
        <Link to="/" className="btn">← Back to Dashboard</Link>
      </div>

      {events.length === 0 ? (
        <div className="empty">No freelance events logged yet.</div>
      ) : (
        <div className="sheet-wrap">
          <table className="sheet">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Notes</th>
                <th>Logged</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.title}</td>
                  <td>{e.event_date}</td>
                  <td>{e.location || '—'}</td>
                  <td>{e.notes || '—'}</td>
                  <td>{new Date(e.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
