import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import SimpleTab from '../components/SimpleTab.jsx'

const TABS = ['Overview', 'Notes', 'Payments', 'Invoices', 'Contracts', 'Timeline', 'Files']
const TIMELINE_STAGES = ['Inquiry', 'Booking', 'Shoot', 'Delivery']

export default function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('Overview')

  const reload = () => api.getClient(id).then(setClient).catch((e) => setError(e.message))

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (error) return <div className="error">Couldn't load client: {error}</div>
  if (!client) return <div className="empty">Loading…</div>

  const totalPaid = client.payments.reduce((sum, p) => sum + p.amount, 0)

  const handleDelete = async () => {
    if (!confirm(`Delete ${client.name}? This removes all their notes, payments, invoices, contracts, timeline and files.`)) return
    await api.deleteClient(id)
    navigate('/')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{client.name}</h1>
          <div className="client-card-meta">
            {client.event_type || 'No event type'} · {client.event_date || 'No date set'} ·{' '}
            <span className="badge">{client.stage}</span>
          </div>
        </div>
        <button className="btn btn-danger" onClick={handleDelete}>Delete Client</button>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? 'tab-active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="tab-panel">
        {tab === 'Overview' && (
          <div className="overview-grid">
            <div><strong>Phone:</strong> {client.phone || '—'}</div>
            <div><strong>Email:</strong> {client.email || '—'}</div>
            <div><strong>Instagram:</strong> {client.instagram || '—'}</div>
            <div><strong>Total package:</strong> {client.total_package ?? '—'}</div>
            <div><strong>Pending balance:</strong> {client.pending_balance}</div>
            <div><strong>Client since:</strong> {new Date(client.created_at).toLocaleDateString()}</div>
          </div>
        )}

        {tab === 'Notes' && (
          <SimpleTab
            fields={[{ name: 'content', label: 'Note', type: 'textarea', required: true }]}
            initial={{ content: '' }}
            onSubmit={async (form) => { await api.addNote(id, form); reload() }}
            items={client.notes}
            emptyLabel="No notes yet"
            renderItem={(n) => (
              <>
                <div>{n.content}</div>
                <div className="entry-meta">{new Date(n.created_at).toLocaleString()}</div>
              </>
            )}
          />
        )}

        {tab === 'Payments' && (
          <>
            <div className="summary-bar">
              <span>Paid: {totalPaid}</span>
              <span>Pending: {client.pending_balance}</span>
            </div>
            <SimpleTab
              fields={[
                { name: 'amount', label: 'Amount', type: 'number', required: true },
                { name: 'payment_date', label: 'Date', type: 'date' },
                { name: 'screenshot_link', label: 'Drive/Dropbox link', type: 'text' },
              ]}
              initial={{ amount: '', payment_date: '', screenshot_link: '' }}
              onSubmit={async (form) => {
                await api.addPayment(id, {
                  ...form,
                  amount: Number(form.amount),
                  payment_date: form.payment_date || null,
                })
                reload()
              }}
              items={client.payments}
              emptyLabel="No payments yet"
              renderItem={(p) => (
                <>
                  <div>{p.amount} — {p.payment_date}</div>
                  {p.screenshot_link && (
                    <a href={p.screenshot_link} target="_blank" rel="noreferrer">View screenshot</a>
                  )}
                </>
              )}
            />
          </>
        )}

        {tab === 'Invoices' && (
          <SimpleTab
            fields={[
              { name: 'invoice_number', label: 'Invoice #', type: 'text' },
              { name: 'amount', label: 'Amount', type: 'number', required: true },
              { name: 'status', label: 'Status', type: 'select', options: ['Unpaid', 'Paid'] },
              { name: 'doc_link', label: 'Drive/Dropbox link', type: 'text' },
            ]}
            initial={{ invoice_number: '', amount: '', status: 'Unpaid', doc_link: '' }}
            onSubmit={async (form) => { await api.addInvoice(id, { ...form, amount: Number(form.amount) }); reload() }}
            items={client.invoices}
            emptyLabel="No invoices yet"
            renderItem={(inv) => (
              <>
                <div>{inv.invoice_number || 'Invoice'} — {inv.amount} — <span className="badge">{inv.status}</span></div>
                {inv.doc_link && <a href={inv.doc_link} target="_blank" rel="noreferrer">View document</a>}
              </>
            )}
          />
        )}

        {tab === 'Contracts' && (
          <SimpleTab
            fields={[
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'signed', label: 'Signed', type: 'select', options: ['Yes', 'No'] },
              { name: 'doc_link', label: 'Drive/Dropbox link', type: 'text' },
            ]}
            initial={{ title: '', signed: 'No', doc_link: '' }}
            onSubmit={async (form) => { await api.addContract(id, form); reload() }}
            items={client.contracts}
            emptyLabel="No contracts yet"
            renderItem={(c) => (
              <>
                <div>{c.title || 'Contract'} — <span className="badge">{c.signed}</span></div>
                {c.doc_link && <a href={c.doc_link} target="_blank" rel="noreferrer">View document</a>}
              </>
            )}
          />
        )}

        {tab === 'Timeline' && (
          <SimpleTab
            fields={[
              { name: 'stage', label: 'Stage', type: 'select', options: TIMELINE_STAGES },
              { name: 'note', label: 'Note (optional)', type: 'text' },
            ]}
            initial={{ stage: TIMELINE_STAGES[0], note: '' }}
            onSubmit={async (form) => { await api.addTimelineEvent(id, form); reload() }}
            items={client.timeline}
            emptyLabel="No timeline history yet"
            renderItem={(t) => (
              <>
                <div><span className="badge">{t.stage}</span> {t.note}</div>
                <div className="entry-meta">{new Date(t.updated_at).toLocaleString()}</div>
              </>
            )}
          />
        )}

        {tab === 'Files' && (
          <SimpleTab
            fields={[
              { name: 'label', label: 'Label', type: 'text', placeholder: 'e.g. Raw photos' },
              { name: 'link', label: 'Drive/Dropbox link', type: 'text', required: true },
            ]}
            initial={{ label: '', link: '' }}
            onSubmit={async (form) => { await api.addFile(id, form); reload() }}
            items={client.files}
            emptyLabel="No files linked yet"
            renderItem={(f) => (
              <a href={f.link} target="_blank" rel="noreferrer">{f.label || f.link}</a>
            )}
          />
        )}
      </div>
    </div>
  )
}
