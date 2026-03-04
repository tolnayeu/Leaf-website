'use client'

import Link from 'next/link'
import { motion, useAnimation, type Easing } from 'motion/react'
import { RefreshCw, ChevronRight } from 'lucide-react'

interface Props {
  text: string
  href?: string
}

const ease: Easing = [0.16, 1, 0.3, 1]

const iconVariants = {
  initial: { rotate: 0 },
  hover: { rotate: -15 },
}

export function AnnouncementBadge({ text, href }: Props) {
  const controls = useAnimation()

  const badge = (
    <motion.div
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium shadow-sm cursor-pointer"
      style={{
        borderColor: 'rgba(120, 194, 135, 0.35)',
        background: 'rgba(120, 194, 135, 0.06)',
        color: 'var(--brand)',
      }}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
      onHoverStart={() => controls.start('hover')}
      onHoverEnd={() => controls.start('initial')}
    >
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate={controls}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      >
        <RefreshCw size={11} strokeWidth={2} />
      </motion.div>
      <span>{text}</span>
      <motion.div style={{ color: 'rgba(120,194,135,0.6)', display: 'flex' }}>
        <ChevronRight size={12} />
      </motion.div>
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'inline-block' }}>
        {badge}
      </Link>
    )
  }
  return badge
}
