import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'

export default function EventForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', event_date: '', location: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await api.createFreelanceEvent(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="form-page">
      <h1>Add Freelance Event</h1>
      <p className="section-hint">
        For unbooked/public opportunities — car shows, pop-up gigs, anything not tied to an
        existing client.
      </p>
      <form onSubmit={submit} className="form">
        <label>
          Title
          <input required value={form.title} onChange={update('title')} placeholder="e.g. Downtown Car Show" />
        </label>
        <label>
          Date
          <input required type="date" value={form.event_date} onChange={update('event_date')} />
        </label>
        <label>
          Location
          <input value={form.location} onChange={update('location')} placeholder="optional" />
        </label>
        <label>
          Notes
          <textarea value={form.notes} onChange={update('notes')} placeholder="optional" />
        </label>

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Event'}
          </button>
        </div>
      </form>
    </div>
  )
}
