import { useState } from 'react'

// fields: [{ name, label, type: 'text'|'textarea'|'number'|'date'|'select', options?, required? }]
export default function SimpleTab({ fields, initial, onSubmit, items, renderItem, emptyLabel }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSubmit(form)
      setForm(initial)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <form onSubmit={submit} className="inline-form">
        {fields.map((f) => (
          <label key={f.name} className="inline-field">
            {f.label}
            {f.type === 'textarea' ? (
              <textarea
                required={f.required}
                value={form[f.name] ?? ''}
                onChange={update(f.name)}
              />
            ) : f.type === 'select' ? (
              <select value={form[f.name] ?? ''} onChange={update(f.name)}>
                {f.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                type={f.type || 'text'}
                required={f.required}
                value={form[f.name] ?? ''}
                onChange={update(f.name)}
                placeholder={f.placeholder}
              />
            )}
          </label>
        ))}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Adding…' : 'Add'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {items.length === 0 ? (
        <div className="empty">{emptyLabel}</div>
      ) : (
        <ul className="entry-list">
          {items.map((item) => (
            <li key={item.id} className="entry">{renderItem(item)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
