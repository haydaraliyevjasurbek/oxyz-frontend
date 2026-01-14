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
import Textarea from '../components/ui/Textarea'

export default function NewsPage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const MotionDiv = motion.div
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    id: null,
    publishedAt: '',
    title: '',
    summary: '',
    content: '',
    image: null,
  })
  const [modalOpen, setModalOpen] = useState(false)

  const isEditing = useMemo(() => form.id != null, [form.id])

  async function load() {
    setLoading(true)
    setError('')

    try {
      const res = await apiFetch('/news')
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
    setForm({ id: null, publishedAt: '', title: '', summary: '', content: '', image: null })
    setModalOpen(true)
  }

  function startEdit(n) {
    setForm({
      id: n.id,
      publishedAt: n.publishedAt || '',
      title: n.title || '',
      summary: n.summary || '',
      content: n.content || '',
      image: null,
    })
    setModalOpen(true)
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const fd = new FormData()
      fd.set('publishedAt', form.publishedAt)
      fd.set('title', form.title)
      fd.set('summary', form.summary)
      fd.set('content', form.content)
      if (form.image) fd.set('image', form.image)

      const res = await apiFetch(isEditing ? `/admin/news/${form.id}` : '/admin/news', {
        method: isEditing ? 'PUT' : 'POST',
        body: fd,
      })

      if (!res.ok) {
        throw new Error((await res.json().catch(() => ({}))).message || 'Save failed')
      }

      setModalOpen(false)
      setForm({ id: null, publishedAt: '', title: '', summary: '', content: '', image: null })
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
    if (!confirm('Delete this news item?')) return
    setError('')

    try {
      const res = await apiFetch(`/admin/news/${id}`, { method: 'DELETE' })
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
        title="News"
        subtitle="Create and manage news posts."
        right={
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={startCreate}>
              Create
            </Button>
            <Button variant="secondary" size="sm" onClick={load} loading={loading}>
              Refresh
            </Button>
          </div>
        }
      />

      <ErrorBanner message={error} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? `Edit post #${form.id}` : 'Create post'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Date</label>
            <Input
              type="date"
              value={form.publishedAt}
              onChange={(e) => setForm((p) => ({ ...p, publishedAt: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Post title"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Summary</label>
            <Textarea
              value={form.summary}
              onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
              placeholder="Short preview text"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Content</label>
            <Textarea
              className="min-h-[160px]"
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              placeholder="Full content"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="news-image" className="text-xs font-medium text-slate-300">
              Image
            </label>
            <input
              id="news-image"
              type="file"
              name=''
              accept="image/*"
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))}
              className="  block w-full text-sm text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-800/70 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-100 hover:file:bg-slate-800"
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
              <EmptyState title="No news" description="Create your first post using the form." />
            ) : (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {items.map((n) => (
                    <MotionDiv
                      key={n.id}
                      layout
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            {n.publishedAt ? <div className="text-xs text-slate-500">{n.publishedAt}</div> : null}
                            <div className="mt-0.5 text-sm font-semibold text-slate-100">{n.title}</div>
                            {n.summary ? (
                              <div className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{n.summary}</div>
                            ) : (
                              <div className="mt-2 text-sm text-slate-500">No summary</div>
                            )}
                            {n.imageMimeType ? (
                              <div className="mt-3">
                                <img
                                  src={apiUrl(`/api/news/${n.id}/image?v=${encodeURIComponent(n.updatedAt || '')}`)}
                                  alt="news"
                                  className="max-h-44 w-full rounded-xl border border-slate-800/60 object-cover"
                                  loading="lazy"
                                  priority="high"
                                />
                              </div>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 flex-row gap-2">
                            <Button variant="secondary" size="sm" onClick={() => startEdit(n)}>
                              Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => remove(n.id)}>
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
