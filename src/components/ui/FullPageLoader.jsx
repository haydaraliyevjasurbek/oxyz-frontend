import Spinner from './Spinner'

export default function FullPageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/40 px-5 py-4 text-sm text-slate-200">
        <Spinner />
        <span>{label}</span>
      </div>
    </div>
  )
}
