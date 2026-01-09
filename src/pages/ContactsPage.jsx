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

const MotionDiv = motion.div

function getSafeMapSrc(mapEmbed) {
  if (!mapEmbed || typeof mapEmbed !== 'string') return null
  try {
    const doc = new DOMParser().parseFromString(mapEmbed, 'text/html')
    const iframe = doc.querySelector('iframe')
    const src = iframe?.getAttribute('src')
    if (!src) return null

    const url = new URL(src, window.location.origin)
    const allowedHosts = new Set(['www.google.com', 'maps.google.com'])
    if (url.protocol !== 'https:' || !allowedHosts.has(url.hostname)) return null
    if (!url.pathname.startsWith('/maps')) return null

    return url.toString()
  } catch {
    return null
  }
}

export default function ContactsPage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    id: null,
    phone1: '',
    phone2: '',
    email: '',
    address: '',
    mapEmbed: '',
  })

  const isEditing = useMemo(() => form.id != null, [form.id])

  async function load() {
    setLoading(true)
    setError('')

    try {
      const res = await apiFetch('/contacts')
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
    setForm({ id: null, phone1: '', phone2: '', email: '', address: '', mapEmbed: '' })
  }

  function startEdit(c) {
    setForm({
      id: c.id,
      phone1: c.phone1 || '',
      phone2: c.phone2 || '',
      email: c.email || '',
      address: c.address || '',
      mapEmbed: c.mapEmbed || '',
    })
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const payload = {
        phone1: form.phone1,
        phone2: form.phone2,
        email: form.email,
        address: form.address,
        mapEmbed: form.mapEmbed,
      }

      const res = await apiFetch(isEditing ? `/contacts/${form.id}` : '/contacts', {
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
    if (!confirm('Delete this contact block?')) return
    setError('')

    try {
      const res = await apiFetch(`/contacts/${id}`, { method: 'DELETE' })
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
        title="Contacts"
        subtitle="Manage contact information and map embed."
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
              {isEditing ? `Edit contact block #${form.id}` : 'Create contact block'}
            </div>
            <div className="mt-1 text-xs text-slate-400">Map embed must be a Google Maps iframe.</div>
          </div>

          <form onSubmit={submit} className="space-y-4 px-5 py-5">
            <div className="space-y-1">
              <label htmlFor="contact-phone1" className="text-xs font-medium text-slate-300">
                Phone 1
              </label>
              <Input
                id="contact-phone1"
                value={form.phone1}
                onChange={(e) => setForm((p) => ({ ...p, phone1: e.target.value }))}
                placeholder="+998 ..."
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-phone2" className="text-xs font-medium text-slate-300">
                Phone 2 (optional)
              </label>
              <Input
                id="contact-phone2"
                value={form.phone2}
                onChange={(e) => setForm((p) => ({ ...p, phone2: e.target.value }))}
                placeholder="+998 ..."
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-email" className="text-xs font-medium text-slate-300">
                Email
              </label>
              <Input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="example@domain.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-address" className="text-xs font-medium text-slate-300">
                Address
              </label>
              <Textarea
                id="contact-address"
                className="min-h-[120px]"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="Full address"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-map" className="text-xs font-medium text-slate-300">
                Map Embed (iframe HTML)
              </label>
              <Textarea
                id="contact-map"
                className="min-h-[140px] font-mono"
                value={form.mapEmbed}
                onChange={(e) => setForm((p) => ({ ...p, mapEmbed: e.target.value }))}
                placeholder="<iframe src=...></iframe>"
                required
              />
              <div className="text-xs text-slate-500">Only https://www.google.com/maps embeds are accepted.</div>
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
                <Skeleton className="h-40" />
                <Skeleton className="h-28" />
              </div>
            ) : items.length === 0 ? (
              <EmptyState title="No contacts" description="Create your first contact block using the form." />
            ) : (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {items.map((c) => (
                    <MotionDiv
                      key={c.id}
                      layout
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                    >
                      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/20 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-slate-500">#{c.id}</div>
                            <div className="mt-1 text-sm font-semibold text-slate-100">{c.email}</div>
                            <div className="mt-2 text-sm text-slate-300">{c.phone1}</div>
                            {c.phone2 ? <div className="text-sm text-slate-300">{c.phone2}</div> : null}
                            <div className="mt-3 text-sm text-slate-300 whitespace-pre-wrap">{c.address}</div>

                            {c.mapEmbed ? (() => {
                              const src = getSafeMapSrc(c.mapEmbed)
                              if (!src) {
                                return (
                                  <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-200">
                                    Map embed is invalid or not allowed.
                                  </div>
                                )
                              }
                              return (
                                <div className="mt-3 overflow-hidden rounded-xl border border-slate-800/60">
                                  <iframe
                                    src={src}
                                    width="100%"
                                    height="320"
                                    className="block"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    sandbox="allow-scripts allow-same-origin allow-popups"
                                    title={`map-${c.id}`}
                                  />
                                </div>
                              )
                            })() : null}
                          </div>

                          <div className="flex shrink-0 flex-col gap-2">
                            <Button size="sm" variant="secondary" onClick={() => startEdit(c)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => remove(c.id)}>
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
