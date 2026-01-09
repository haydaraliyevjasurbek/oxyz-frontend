export default function EmptyState({ title = 'No data', description }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800/70 bg-slate-950/20 p-8 text-center">
      <div className="text-sm font-medium text-slate-200">{title}</div>
      {description ? <div className="mt-1 text-sm text-slate-400">{description}</div> : null}
    </div>
  )
}
