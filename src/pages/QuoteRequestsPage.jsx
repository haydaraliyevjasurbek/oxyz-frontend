import { AnimatePresence } from 'framer-motion'
import Modal from '../components/ui/Modal'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import ErrorBanner from '../components/ui/ErrorBanner'
import Input from '../components/ui/Input'
import PageHeader from '../components/ui/PageHeader'
import Skeleton from '../components/ui/Skeleton'

const emptyForm = {
  id: null,
  from: '',
  to: '',
  cargo: '',
  weight: '',
  transport: '',
  name: '',
  phone: '',
}

export default function QuoteRequestsPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ ...emptyForm })
  const [modalOpen, setModalOpen] = useState(false)

  const isEditing = useMemo(() => form.id != null, [form.id])

  async function load() {
    setLoading(true)
    setError('')

    try {
      const res = await apiFetch('admin/quote-requests')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      if (String(err.message).includes('Unauthorized')) {
        navigate('/login', { replace: true })
        return
      }
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startCreate() {
    setForm({ ...emptyForm })
    setModalOpen(true)
  }

  function startEdit(q) {
    setForm({
      id: q.id,
      from: q.from || '',
      to: q.to || '',
      cargo: q.cargo || '',
      weight: q.weight || '',
      transport: q.transport || '',
      name: q.name || '',
      phone: q.phone || '',
    })
    setModalOpen(true)
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const payload = {
        from: form.from,
        to: form.to,
        cargo: form.cargo,
        weight: form.weight,
        transport: form.transport,
        name: form.name,
        phone: form.phone,
      }

      const res = await apiFetch(isEditing ? `/admin/quote-requests/${form.id}` : '/admin/quote-requests', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error((await res.json().catch(() => ({}))).message || 'Save failed')
      }

      setModalOpen(false)
      setForm({ ...emptyForm })
      await load()
    } catch (err) {
      if (String(err.message).includes('Unauthorized')) {
        navigate('/login', { replace: true })
        return
      }
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this quote request?')) return
    setError('')

    try {
      const res = await apiFetch(`/admin/quote-requests/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) {
        throw new Error((await res.json().catch(() => ({}))).message || 'Delete failed')
      }
      await load()
    } catch (err) {
      if (String(err.message).includes('Unauthorized')) {
        navigate('/login', { replace: true })
        return
      }
      setError(err.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quote Requests"
        subtitle="View and manage quote requests from users."
        right={
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={startCreate}>
              Create Request
            </Button>
            <Button variant="secondary" size="sm" onClick={load} loading={loading}>
              Refresh
            </Button>
          </div>
        }
      />

      <ErrorBanner message={error} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? `Edit request #${form.id}` : 'Create request'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="qr-from" className="text-xs font-medium text-slate-300">
              Откуда
            </label>
            <Input
              id="qr-from"
              value={form.from}
              onChange={(e) => setForm((p) => ({ ...p, from: e.target.value }))}
              placeholder="City / Location"
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="qr-to" className="text-xs font-medium text-slate-300">
              Куда
            </label>
            <Input
              id="qr-to"
              value={form.to}
              onChange={(e) => setForm((p) => ({ ...p, to: e.target.value }))}
              placeholder="City / Location"
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="qr-cargo" className="text-xs font-medium text-slate-300">
              Какой груз
            </label>
            <Input
              id="qr-cargo"
              value={form.cargo}
              onChange={(e) => setForm((p) => ({ ...p, cargo: e.target.value }))}
              placeholder="Cargo"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="qr-weight" className="text-xs font-medium text-slate-300">
                Вес груза
              </label>
              <Input
                id="qr-weight"
                value={form.weight}
                onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
                placeholder="e.g. 1500 kg"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="qr-transport" className="text-xs font-medium text-slate-300">
                Вид транспорта
              </label>
              <Input
                id="qr-transport"
                value={form.transport}
                onChange={(e) => setForm((p) => ({ ...p, transport: e.target.value }))}
                placeholder="Truck / Air / Rail"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="qr-name" className="text-xs font-medium text-slate-300">
                Имя
              </label>
              <Input
                id="qr-name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Full name"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="qr-phone" className="text-xs font-medium text-slate-300">
                Номер телефона
              </label>
              <Input
                id="qr-phone"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+998..."
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" loading={saving}>
              {isEditing ? 'Save changes' : 'Create'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

        <Card>
          <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 px-5 py-4">
            <div>
              <div className="text-sm font-semibold text-slate-100">List</div>
              <div className="mt-1 text-xs text-slate-400">{items.length} items</div>
            </div>
          </div>

          <div className="space-y-3 px-5 py-5">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
              </div>
            ) : items.length === 0 ? (
              <EmptyState title="No quote requests" description="Requests will appear here once submitted." />
            ) : (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {items.map((q) => (
                    <div
                      key={q.id}
                      style={{ position: 'relative' }}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-slate-500">#{q.id}</div>
                            <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-slate-300">
                              <div className="whitespace-pre-wrap">{`Откуда: ${q.from}`}</div>
                              <div className="whitespace-pre-wrap">{`Куда: ${q.to}`}</div>
                              <div className="whitespace-pre-wrap">{`Какой груз: ${q.cargo}`}</div>
                              <div className="whitespace-pre-wrap">{`Вес груза: ${q.weight}`}</div>
                              <div className="whitespace-pre-wrap">{`Вид транспорта: ${q.transport}`}</div>
                              <div className="whitespace-pre-wrap">{`Имя: ${q.name}`}</div>
                              <div className="whitespace-pre-wrap">{`Телефон: ${q.phone}`}</div>
                            </div>

                            {q.createdAt ? (
                              <div className="mt-3 text-xs text-slate-500">
                                Created: {new Date(q.createdAt).toLocaleString()}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 flex-row gap-2">
                            <Button size="sm" variant="secondary" onClick={() => startEdit(q)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => remove(q.id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </Card>
      </div>
  )
}
