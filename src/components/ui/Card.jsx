import { cn } from './cn'

export default function Card({ className, children }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-800/60 bg-slate-950/40 shadow-sm backdrop-blur',
        className
      )}
    >
      {children}
    </div>
  )
}
