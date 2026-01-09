export function getToken() {
  return localStorage.getItem('token')
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('/api/')
    ? path
    : `/api${path.startsWith('/') ? path : `/${path}`}`

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
