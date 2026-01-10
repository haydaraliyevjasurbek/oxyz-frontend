import { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  let color = 'bg-slate-800 text-white'
  if (type === 'success') color = 'bg-green-600 text-white'
  if (type === 'error') color = 'bg-red-600 text-white'
  if (type === 'warning') color = 'bg-yellow-500 text-black'

  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg transition-all ${color}`}
      style={{ minWidth: 200 }}
      role="alert"
    >
      {message}
    </div>
  )
}
