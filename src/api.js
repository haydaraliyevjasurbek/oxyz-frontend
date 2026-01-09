export function getToken() {
  return localStorage.getItem('token')
}

function getApiBase() {
  const base = import.meta.env.VITE_API_URL
  if (!base || typeof base !== 'string') return ''
  return base.replace(/\/+$/, '')
}

function stripApiPrefix(path) {
  // backend routes are like /auth, /services, /stats...
  // in dev we use Vite proxy via /api/*, so keep compatibility.
  if (path.startsWith('/api/')) return path.slice(4)
  if (path === '/api') return '/'
  return path
}

export function apiUrl(path) {
  const apiBase = getApiBase()
  const raw = typeof path === 'string' ? path : ''

  // absolute URL passthrough
  if (/^https?:\/\//i.test(raw)) return raw

  const normalized = raw.startsWith('/') ? raw : `/${raw}`

  if (apiBase) {
    return `${apiBase}${stripApiPrefix(normalized)}`
  }

  // dev default: Vite proxy expects /api/*
  return normalized.startsWith('/api/') ? normalized : `/api${normalized}`
}

export async function apiFetch(path, options = {}) {
  const url = apiUrl(path)

  const headers = new Headers(options.headers || {})
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (res.status === 401) {
    localStorage.removeItem('token')
    throw new Error('Unauthorized')
  }

  return res
}
