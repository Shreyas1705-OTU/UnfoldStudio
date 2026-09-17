import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'

const EVENT_TYPES = ['Wedding', 'Engagement', 'Portrait', 'Event', 'Other']

export default function ClientForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    instagram: '',
    event_type: EVENT_TYPES[0],
    event_date: '',
    total_package: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        ...form,
        event_date: form.event_date || null,
        total_package: form.total_package ? Number(form.total_package) : null,
      }
      const client = await api.createClient(payload)
      navigate(`/clients/${client.id}`)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="form-page">
      <h1>New Client</h1>
      <form onSubmit={submit} className="form">
        <label>
          Name
          <input required value={form.name} onChange={update('name')} />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={update('phone')} />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={update('email')} />
        </label>
        <label>
          Instagram
          <input value={form.instagram} onChange={update('instagram')} placeholder="@handle" />
        </label>
        <label>
          Event type
          <select value={form.event_type} onChange={update('event_type')}>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Event date
          <input type="date" value={form.event_date} onChange={update('event_date')} />
        </label>
        <label>
          Total package amount
          <input type="number" min="0" step="0.01" value={form.total_package} onChange={update('total_package')} />
        </label>

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Client'}
          </button>
        </div>
      </form>
    </div>
  )
}
