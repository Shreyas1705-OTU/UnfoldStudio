const BASE_URL = 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${options.method || 'GET'} ${path} failed: ${res.status} ${text}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  listClients: () => request('/clients'),
  createClient: (data) => request('/clients', { method: 'POST', body: JSON.stringify(data) }),
  getClient: (id) => request(`/clients/${id}`),
  updateClient: (id, data) => request(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteClient: (id) => request(`/clients/${id}`, { method: 'DELETE' }),

  addNote: (id, data) => request(`/clients/${id}/notes`, { method: 'POST', body: JSON.stringify(data) }),
  addPayment: (id, data) => request(`/clients/${id}/payments`, { method: 'POST', body: JSON.stringify(data) }),
  addInvoice: (id, data) => request(`/clients/${id}/invoices`, { method: 'POST', body: JSON.stringify(data) }),
  addContract: (id, data) => request(`/clients/${id}/contracts`, { method: 'POST', body: JSON.stringify(data) }),
  addTimelineEvent: (id, data) => request(`/clients/${id}/timeline`, { method: 'POST', body: JSON.stringify(data) }),
  addFile: (id, data) => request(`/clients/${id}/files`, { method: 'POST', body: JSON.stringify(data) }),

  listFreelanceEvents: () => request('/events'),
  createFreelanceEvent: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  deleteFreelanceEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),
}
