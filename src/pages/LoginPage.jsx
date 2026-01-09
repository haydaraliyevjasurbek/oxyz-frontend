import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ErrorBanner from '../components/ui/ErrorBanner'
import Input from '../components/ui/Input'

export default function LoginPage() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || 'Login failed')
      }

      const data = await res.json()
      if (!data.token) throw new Error('Token not returned')

      localStorage.setItem('token', data.token)
      navigate('/services', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[680px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="mb-6 text-center">
            <div className="text-sm font-semibold tracking-wide text-slate-200">OXYZ Admin</div>
            <h1 className="mt-2 text-2xl font-semibold">Sign in</h1>
            <p className="mt-1 text-sm text-slate-400">Use your admin credentials to continue</p>
          </div>

          <Card>
            <div className="p-5 sm:p-6">
              <form onSubmit={onSubmit} className="space-y-4">
                <ErrorBanner message={error} />

                <div className="space-y-1">
                  <label className="text-sm text-slate-300">Login</label>
                  <Input
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Enter login"
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-slate-300">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  Sign in
                </Button>

                <div className="text-xs text-slate-500">Protected area. Unauthorized attempts are limited.</div>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
