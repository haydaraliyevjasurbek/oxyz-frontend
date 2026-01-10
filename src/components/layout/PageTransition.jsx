// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export default function PageTransition({ children, routeKey }) {
  const reduce = useReducedMotion()

  const initial = reduce ? { opacity: 0 } : { opacity: 0, y: 10 }
  const animate = reduce ? { opacity: 1 } : { opacity: 1, y: 0 }
  const exit = reduce ? { opacity: 0 } : { opacity: 0, y: -8 }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
