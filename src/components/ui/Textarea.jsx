import { cn } from './cn'

export default function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'min-h-[96px] w-full rounded-xl border border-slate-700/60 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
        className
      )}
      {...props}
    />
  )
}
