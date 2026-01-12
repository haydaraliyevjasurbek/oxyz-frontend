
export function getToken() {
  return localStorage.getItem('token');
}

// --- PUBLIC API ---
// Service
export const getServices = () => apiFetch('/api/services');
export const getServiceById = (id) => apiFetch(`/api/services/${id}`);
export const getServiceImage = (id) => apiFetch(`/api/services/${id}/image`);

// Process Steps
export const getProcessSteps = () => apiFetch('/api/process-steps');
export const getProcessStepById = (id) => apiFetch(`/api/process-steps/${id}`);

// Stats
export const getStats = () => apiFetch('/api/stats');
export const getStatById = (id) => apiFetch(`/api/stats/${id}`);
export const getStatIcon = (id) => apiFetch(`/api/stats/${id}/icon`);

// News
export const getNews = () => apiFetch('/api/news');
export const getNewsById = (id) => apiFetch(`/api/news/${id}`);
export const getNewsImage = (id) => apiFetch(`/api/news/${id}/image`);

// Faqs
export const getFaqs = () => apiFetch('/api/faqs');
export const getFaqById = (id) => apiFetch(`/api/faqs/${id}`);

// Contacts
export const getContacts = () => apiFetch('/api/contacts');
export const getContactById = (id) => apiFetch(`/api/contacts/${id}`);

// Quote Forms
export const getQuoteForms = () => apiFetch('/api/quote-forms');
export const getQuoteFormById = (id) => apiFetch(`/api/quote-forms/${id}`);

// Quote Requests (public)
export const postQuoteRequest = (data) => apiFetch('/api/quote-requests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

// --- ADMIN (PRIVATE) API ---
// Service CRUD
export const adminGetServices = () => apiFetch('/admin/services');
export const adminGetServiceById = (id) => apiFetch(`/admin/services/${id}`);
export const adminCreateService = (data) => apiFetch('/admin/services', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminUpdateService = (id, data) => apiFetch(`/admin/services/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminDeleteService = (id) => apiFetch(`/admin/services/${id}`, {
  method: 'DELETE',
});

// Process Steps CRUD
export const adminGetProcessSteps = () => apiFetch('/admin/process-steps');
export const adminGetProcessStepById = (id) => apiFetch(`/admin/process-steps/${id}`);
export const adminCreateProcessStep = (data) => apiFetch('/admin/process-steps', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminUpdateProcessStep = (id, data) => apiFetch(`/admin/process-steps/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminDeleteProcessStep = (id) => apiFetch(`/admin/process-steps/${id}`, {
  method: 'DELETE',
});

// Stats CRUD
export const adminGetStats = () => apiFetch('/admin/stats');
export const adminGetStatById = (id) => apiFetch(`/admin/stats/${id}`);
export const adminCreateStat = (data) => apiFetch('/admin/stats', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminUpdateStat = (id, data) => apiFetch(`/admin/stats/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminDeleteStat = (id) => apiFetch(`/admin/stats/${id}`, {
  method: 'DELETE',
});

// News CRUD
export const adminGetNews = () => apiFetch('/admin/news');
export const adminGetNewsById = (id) => apiFetch(`/admin/news/${id}`);
export const adminCreateNews = (data) => apiFetch('/admin/news', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminUpdateNews = (id, data) => apiFetch(`/admin/news/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminDeleteNews = (id) => apiFetch(`/admin/news/${id}`, {
  method: 'DELETE',
});

// Faqs CRUD
export const adminGetFaqs = () => apiFetch('/admin/faqs');
export const adminGetFaqById = (id) => apiFetch(`/admin/faqs/${id}`);
export const adminCreateFaq = (data) => apiFetch('/admin/faqs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminUpdateFaq = (id, data) => apiFetch(`/admin/faqs/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminDeleteFaq = (id) => apiFetch(`/admin/faqs/${id}`, {
  method: 'DELETE',
});

// Contacts CRUD
export const adminGetContacts = () => apiFetch('/admin/contacts');
export const adminGetContactById = (id) => apiFetch(`/admin/contacts/${id}`);
export const adminCreateContact = (data) => apiFetch('/admin/contacts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminUpdateContact = (id, data) => apiFetch(`/admin/contacts/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminDeleteContact = (id) => apiFetch(`/admin/contacts/${id}`, {
  method: 'DELETE',
});

// Quote Forms CRUD
export const adminGetQuoteForms = () => apiFetch('/admin/quote-forms');
export const adminGetQuoteFormById = (id) => apiFetch(`/admin/quote-forms/${id}`);
export const adminCreateQuoteForm = (data) => apiFetch('/admin/quote-forms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminUpdateQuoteForm = (id, data) => apiFetch(`/admin/quote-forms/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminDeleteQuoteForm = (id) => apiFetch(`/admin/quote-forms/${id}`, {
  method: 'DELETE',
});

// Quote Requests CRUD
export const adminGetQuoteRequests = () => apiFetch('/admin/quote-requests');
export const adminGetQuoteRequestById = (id) => apiFetch(`/admin/quote-requests/${id}`);
export const adminCreateQuoteRequest = (data) => apiFetch('/admin/quote-requests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminUpdateQuoteRequest = (id, data) => apiFetch(`/admin/quote-requests/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const adminDeleteQuoteRequest = (id) => apiFetch(`/admin/quote-requests/${id}`, {
  method: 'DELETE',
});

// --- AUTH ---
export const login = (data) => apiFetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

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
