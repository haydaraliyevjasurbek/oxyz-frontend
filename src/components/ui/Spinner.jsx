import { cn } from './cn'

export default function Spinner({ className }) {
  return (
    <div
      className={cn(
        'h-5 w-5 animate-spin rounded-full border-2 border-slate-300/30 border-t-slate-200',
        className
      )}
    />
  )
}
