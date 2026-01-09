import { cn } from './cn'

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl border border-slate-700/60 bg-slate-900/40 px-3 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
        className
      )}
      {...props}
    />
  )
}
