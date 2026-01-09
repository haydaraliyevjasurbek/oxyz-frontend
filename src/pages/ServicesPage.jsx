import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
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

export default function ServicesPage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    id: null,
    title: '',
    description: '',
    image: null,
  })

  const isEditing = useMemo(() => form.id != null, [form.id])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/services')
      const data = await res.json()
      setServices(Array.isArray(data) ? data : [])
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
    setForm({ id: null, title: '', description: '', image: null })
  }

  function startEdit(s) {
    setForm({ id: s.id, title: s.title || '', description: s.description || '', image: null })
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const fd = new FormData()
      fd.set('title', form.title)
      fd.set('description', form.description)
      if (form.image) fd.set('image', form.image)

      if (isEditing) {
        const res = await apiFetch(`/services/${form.id}`, { method: 'PUT', body: fd })
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Update failed')
      } else {
        const res = await apiFetch('/services', { method: 'POST', body: fd })
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Create failed')
      }

      startCreate()
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
    if (!confirm('Delete this service?')) return
    setError('')

    try {
      const res = await apiFetch(`/services/${id}`, { method: 'DELETE' })
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
        title="Services"
        subtitle="Create, update, and manage services."
        right={
          <Button variant="secondary" size="sm" onClick={load} loading={loading}>
            Refresh
          </Button>
        }
      />

      <ErrorBanner message={error} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="border-b border-slate-800/60 px-5 py-4">
            <div className="text-sm font-semibold text-slate-100">
              {isEditing ? `Edit service #${form.id}` : 'Create service'}
            </div>
            <div className="mt-1 text-xs text-slate-400">Images are optional (max 10MB).</div>
          </div>

          <form onSubmit={submit} className="space-y-4 px-5 py-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Service title"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="service-image" className="text-xs font-medium text-slate-300">
                Image
              </label>
              <input
                id="service-image"
                type="file"
                accept="image/*"
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))}
                className="block w-full text-sm text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-800/70 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-100 hover:file:bg-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" loading={saving}>
                {isEditing ? 'Save changes' : 'Create'}
              </Button>
              {isEditing ? (
                <Button type="button" variant="secondary" onClick={startCreate} disabled={saving}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 px-5 py-4">
            <div>
              <div className="text-sm font-semibold text-slate-100">List</div>
              <div className="mt-1 text-xs text-slate-400">{services.length} items</div>
            </div>
            <Button variant="secondary" size="sm" onClick={load} loading={loading}>
              Refresh
            </Button>
          </div>

          <div className="space-y-3 px-5 py-5">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            ) : services.length === 0 ? (
              <EmptyState title="No services" description="Create your first service using the form." />
            ) : (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {services.map((s) => (
                    <motion.div
                      key={s.id}
                      layout
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                    >
                      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/20 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-100">{s.title}</div>
                            {s.description ? (
                              <div className="mt-1 text-sm text-slate-300">{s.description}</div>
                            ) : (
                              <div className="mt-1 text-sm text-slate-500">No description</div>
                            )}
                            <div className="mt-2 text-xs text-slate-500">
                              Image: {s.imageMimeType ? s.imageMimeType : '—'}
                            </div>
                            {s.imageMimeType ? (
                              <div className="mt-3">
                                <img
                                  src={`/api/services/${s.id}/image?v=${encodeURIComponent(s.updatedAt || '')}`}
                                  alt="service"
                                  className="max-h-40 w-full rounded-xl border border-slate-800/60 object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ) : null}
                          </div>

                          <div className="flex shrink-0 flex-col gap-2">
                            <Button variant="secondary" size="sm" onClick={() => startEdit(s)}>
                              Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => remove(s.id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
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
