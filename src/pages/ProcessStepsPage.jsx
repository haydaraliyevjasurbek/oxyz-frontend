import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
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
import Textarea from '../components/ui/Textarea'

export default function ProcessStepsPage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const MotionDiv = motion.div
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    id: null,
    order: 1,
    title: '',
    description: '',
    details: '',
  })

  const isEditing = useMemo(() => form.id != null, [form.id])

  async function load() {
    setLoading(true)
    setError('')

    try {
      const res = await apiFetch('/admin/process-steps')
      const data = await res.json()
      setSteps(Array.isArray(data) ? data : [])
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
    setForm({ id: null, order: 1, title: '', description: '', details: '' })
    setModalOpen(true)
  }

  function startEdit(s) {
    setForm({
      id: s.id,
      order: Number(s.order ?? 1),
      title: s.title || '',
      description: s.description || '',
      details: s.details || '',
    })
    setModalOpen(true)
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const payload = {
        order: Number(form.order),
        title: form.title,
        description: form.description,
        details: form.details || null,
      }

      const res = await apiFetch(isEditing ? `/admin/process-steps/${form.id}` : '/admin/process-steps', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error((await res.json().catch(() => ({}))).message || 'Save failed')
      }

      setModalOpen(false)
      setForm({ id: null, order: 1, title: '', description: '', details: '' })
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
    if (!confirm('Delete this step?')) return
    setError('')

    try {
      const res = await apiFetch(`/admin/process-steps/${id}`, { method: 'DELETE' })
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
        title="Process Steps"
        subtitle="Create and manage process steps."
        right={
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={startCreate}>
              Create Step
            </Button>
            <Button variant="secondary" size="sm" onClick={load} loading={loading}>
              Refresh
            </Button>
          </div>
        }
      />

      <ErrorBanner message={error} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? `Edit step #${form.id}` : 'Create step'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="step-order" className="text-xs font-medium text-slate-300">
              Order
            </label>
            <Input
              id="step-order"
              type="number"
              min={1}
              value={form.order}
              onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="step-title" className="text-xs font-medium text-slate-300">
              Title
            </label>
            <Input
              id="step-title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Step title"
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="step-description" className="text-xs font-medium text-slate-300">
              Description
            </label>
            <Textarea
              id="step-description"
              className="min-h-[120px]"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="What happens in this step?"
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="step-details" className="text-xs font-medium text-slate-300">
              Details (optional)
            </label>
            <Textarea
              id="step-details"
              className="min-h-[140px]"
              value={form.details}
              onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))}
              placeholder="Additional details"
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
              <div className="mt-1 text-xs text-slate-400">{steps.length} items</div>
            </div>
          </div>
          <div className="space-y-3 px-5 py-5">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
              </div>
            ) : steps.length === 0 ? (
              <EmptyState title="No steps" description="Create your first process step using the form." />
            ) : (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {steps.map((s) => (
                    <MotionDiv
                      key={s.id}
                      layout
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-xs text-slate-500">#{s.order}</div>
                            <div className="mt-1 text-sm font-semibold text-slate-100">{s.title}</div>
                            <div className="mt-2 text-sm text-slate-300 whitespace-pre-wrap">{s.description}</div>
                            {s.details ? (
                              <div className="mt-3 rounded-xl border border-slate-800/60 bg-slate-950/30 p-3 text-sm text-slate-300 whitespace-pre-wrap">
                                {s.details}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 flex-row gap-2">
                            <Button size="sm" variant="secondary" onClick={() => startEdit(s)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => remove(s.id)}>
                              Delete
                            </Button>
                          </div>
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
