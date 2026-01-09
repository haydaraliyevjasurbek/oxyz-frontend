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

export default function FaqsPage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    id: null,
    order: 1,
    question: '',
    answer: '',
  })

  const isEditing = useMemo(() => form.id != null, [form.id])

  async function load() {
    setLoading(true)
    setError('')

    try {
      const res = await apiFetch('/faqs')
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
    setForm({ id: null, order: 1, question: '', answer: '' })
  }

  function startEdit(f) {
    setForm({
      id: f.id,
      order: Number(f.order ?? 1),
      question: f.question || '',
      answer: f.answer || '',
    })
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const payload = {
        order: Number(form.order),
        question: form.question,
        answer: form.answer,
      }

      const res = await apiFetch(isEditing ? `/faqs/${form.id}` : '/faqs', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error((await res.json().catch(() => ({}))).message || 'Save failed')
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
    if (!confirm('Delete this FAQ?')) return
    setError('')

    try {
      const res = await apiFetch(`/faqs/${id}`, { method: 'DELETE' })
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
        title="FAQs"
        subtitle="Create and manage frequently asked questions."
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
              {isEditing ? `Edit FAQ #${form.id}` : 'Create FAQ'}
            </div>
            <div className="mt-1 text-xs text-slate-400">Order controls display priority.</div>
          </div>

          <form onSubmit={submit} className="space-y-4 px-5 py-5">
            <div className="space-y-1">
              <label htmlFor="faq-order" className="text-xs font-medium text-slate-300">
                Order
              </label>
              <Input
                id="faq-order"
                type="number"
                min={1}
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="faq-question" className="text-xs font-medium text-slate-300">
                Question
              </label>
              <Input
                id="faq-question"
                value={form.question}
                onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                placeholder="Example: How long does delivery take?"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="faq-answer" className="text-xs font-medium text-slate-300">
                Answer
              </label>
              <Textarea
                id="faq-answer"
                className="min-h-[160px]"
                value={form.answer}
                onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
                placeholder="Write a clear answer"
                required
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
              <div className="mt-1 text-xs text-slate-400">{items.length} items</div>
            </div>
            <Button variant="secondary" size="sm" onClick={load} loading={loading}>
              Refresh
            </Button>
          </div>

          <div className="space-y-3 px-5 py-5">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
              </div>
            ) : items.length === 0 ? (
              <EmptyState title="No FAQs" description="Create your first FAQ using the form." />
            ) : (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {items.map((f) => (
                    <motion.div
                      key={f.id}
                      layout
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                    >
                      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/20 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-xs text-slate-500">#{f.order}</div>
                            <div className="mt-1 text-sm font-semibold text-slate-100">{f.question}</div>
                            <div className="mt-2 text-sm text-slate-300 whitespace-pre-wrap">{f.answer}</div>
                          </div>

                          <div className="flex shrink-0 flex-col gap-2">
                            <Button size="sm" variant="secondary" onClick={() => startEdit(f)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => remove(f.id)}>
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
