export default function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div
      role="alert"
      aria-live="polite"
      className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
    >
      {message}
    </div>
  )
}
