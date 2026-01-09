import { cn } from './cn'

export default function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-xl bg-slate-800/60', className)} />
}
