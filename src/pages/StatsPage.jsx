import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Modal from '../components/ui/Modal'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch, apiUrl } from '../api'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import ErrorBanner from '../components/ui/ErrorBanner'
import Input from '../components/ui/Input'
import PageHeader from '../components/ui/PageHeader'
import Skeleton from '../components/ui/Skeleton'

export default function StatsPage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const MotionDiv = motion.div

  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    id: null,
    order: 1,
    value: '',
    label: '',
    icon: null,
  })

  const isEditing = useMemo(() => form.id != null, [form.id])

  async function load() {
    setLoading(true)
    setError('')

    try {
      const res = await apiFetch('/stats')
      const data = await res.json()
      setStats(Array.isArray(data) ? data : [])
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

  const [modalOpen, setModalOpen] = useState(false)
  function startCreate() {
    setForm({ id: null, order: 1, value: '', label: '', icon: null })
    setModalOpen(true)
  }

  function startEdit(s) {
    setForm({
      id: s.id,
      order: Number(s.order ?? 1),
      value: s.value || '',
      label: s.label || '',
      icon: null,
    })
    setModalOpen(true)
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const fd = new FormData()
      fd.set('order', String(form.order))
      fd.set('value', form.value)
      fd.set('label', form.label)
      if (form.icon) fd.set('icon', form.icon)

      const res = await apiFetch(isEditing ? `/stats/${form.id}` : '/stats', {
        method: isEditing ? 'PUT' : 'POST',
        body: fd,
      })

      if (!res.ok) {
        throw new Error((await res.json().catch(() => ({}))).message || 'Save failed')
      }

      setModalOpen(false)
      setForm({ id: null, order: 1, value: '', label: '', icon: null })
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
    if (!confirm('Delete this stat?')) return
    setError('')

    try {
      const res = await apiFetch(`/stats/${id}`, { method: 'DELETE' })
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
        title="Stats"
        subtitle="Create and manage homepage stats."
        right={
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={startCreate}>
              Create Stat
            </Button>
            <Button variant="secondary" size="sm" onClick={load} loading={loading}>
              Refresh
            </Button>
          </div>
        }
      />

      <ErrorBanner message={error} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? `Edit stat #${form.id}` : 'Create stat'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Order</label>
            <Input
              type="number"
              value={form.order}
              onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
              min={1}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Value</label>
            <Input
              value={form.value}
              onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
              placeholder="Example: +15 000, 99%, 100%"
              required
            />
            <div className="text-xs text-slate-500">Tip: keep it short and readable.</div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Label</label>
            <Input
              value={form.label}
              onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
              placeholder="Example: Projects completed"
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="stat-icon" className="text-xs font-medium text-slate-300">
              Icon
            </label>
            <input
              id="stat-icon"
              type="file"
              accept="image/*"
              onChange={(e) => setForm((p) => ({ ...p, icon: e.target.files?.[0] || null }))}
              className="block w-full text-sm text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-800/70 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-100 hover:file:bg-slate-800"
            />
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
        <Card>
          <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 px-5 py-4">
            <div>
              <div className="text-sm font-semibold text-slate-100">List</div>
              <div className="mt-1 text-xs text-slate-400">{stats.length} items</div>
            </div>
          </div>
          <div className="space-y-3 px-5 py-5">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            ) : stats.length === 0 ? (
              <EmptyState title="No stats" description="Create your first stat using the form." />
            ) : (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {stats.map((s) => (
                    <MotionDiv
                      key={s.id}
                      layout
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                    >
                      <div className="flex items-start justify-between gap-4 p-4">
                        <div className="flex min-w-0 items-start gap-3">
                          {s.iconMimeType ? (
                            <img
                              src={apiUrl(`/api/stats/${s.id}/icon?v=${encodeURIComponent(s.updatedAt || '')}`)}
                              alt="icon"
                              className="h-10 w-10 rounded-xl border border-slate-800/60 bg-slate-950/30 object-contain"
                              loading="lazy"
                              priority="high"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-xl border border-dashed border-slate-700/60 bg-slate-950/10" />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs text-slate-500">#{s.order}</div>
                            <div className="truncate text-base font-semibold text-slate-100">{s.value}</div>
                            <div className="mt-0.5 text-sm text-slate-300">{s.label}</div>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-row gap-2">
                          <Button variant="secondary" size="sm" onClick={() => startEdit(s)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => remove(s.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </MotionDiv>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
