import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Button from '../ui/Button'
import { cn } from '../ui/cn'

const MotionDiv = motion.div
const MotionAside = motion.aside

const NAV = [
  { to: '/services', label: 'Services' },
  { to: '/process-steps', label: 'Process Steps' },
  { to: '/stats', label: 'Stats' },
  { to: '/news', label: 'News' },
  { to: '/faqs', label: 'FAQs' },
  { to: '/contacts', label: 'Contacts' },
  { to: '/quote-requests', label: 'Quote Requests' },
]

function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        <div className="text-sm font-semibold tracking-wide text-slate-200">OXYZ Admin</div>
        <div className="mt-1 text-xs text-slate-400">Modern Dashboard</div>
      </div>

      <div className="px-2">
        <div className="h-px bg-slate-800/60" />
      </div>

      <nav className="flex-1 space-y-1 px-2 py-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between rounded-xl px-3 py-2 text-sm transition',
                isActive
                  ? 'bg-sky-500/10 text-sky-200 ring-1 ring-sky-500/20'
                  : 'text-slate-200 hover:bg-slate-800/50'
              )
            }
          >
            <span>{item.label}</span>
            <span className="text-xs text-slate-500">›</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-5 pt-2">
        <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 text-xs text-slate-400">
          Tip: images are loaded via public endpoints.
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!mobileOpen) return

    function onKeyDown(e) {
      if (e.key === 'Escape') setMobileOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  const title = useMemo(() => {
    const found = NAV.find((x) => location.pathname.startsWith(x.to))
    return found?.label ?? 'Admin'
  }, [location.pathname])

  function logout() {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[680px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-800/60 bg-slate-950/30 backdrop-blur lg:block">
          <Sidebar />
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen ? (
            <>
              <MotionDiv
                className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />
              <MotionAside
                className="fixed left-0 top-0 z-50 h-full w-[84%] max-w-xs border-r border-slate-800/60 bg-slate-950/90 backdrop-blur lg:hidden"
                initial={reduce ? { opacity: 0 } : { x: -40, opacity: 0 }}
                animate={reduce ? { opacity: 1 } : { x: 0, opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { x: -40, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </MotionAside>
            </>
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-10 border-b border-slate-800/60 bg-slate-950/30 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileOpen(true)}
                >
                  Menu
                </Button>
                <div>
                  <div className="text-sm font-semibold text-slate-100">{title}</div>
                  <div className="text-xs text-slate-400">Manage your content</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>

          <footer className="border-t border-slate-800/60 px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8">
            © {new Date().getFullYear()} OXYZ Admin
          </footer>
        </div>
      </div>
    </div>
  )
}
