import { motion } from 'framer-motion'
import { cn } from './cn'

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  disabled,
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-sky-600 text-white hover:bg-sky-500 active:bg-sky-700',
    secondary:
      'bg-slate-800/70 text-slate-100 hover:bg-slate-800 active:bg-slate-900 border border-slate-700/60',
    ghost:
      'bg-transparent text-slate-200 hover:bg-slate-800/60 active:bg-slate-800',
    danger:
      'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  }

  const MotionButton = motion.button

  return (
    <MotionButton
      type={props.type ?? 'button'}
      whileTap={{ scale: 0.98 }}
      whileHover={disabled || loading ? undefined : { y: -1 }}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </MotionButton>
  )
}
