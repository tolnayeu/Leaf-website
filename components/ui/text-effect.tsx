'use client'

import { AnimatePresence, motion, type Variants } from 'framer-motion'
import React from 'react'

type Preset = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide'

type TextEffectProps = {
  children: string
  per?: 'word' | 'char' | 'line'
  as?: keyof React.JSX.IntrinsicElements
  preset?: Preset
  delay?: number
  speedReveal?: number
  speedSegment?: number
  trigger?: boolean
  variants?: { container?: Variants; item?: Variants }
  className?: string
  style?: React.CSSProperties
  segmentWrapperClassName?: string
  onAnimationComplete?: () => void
}

const presetVariants: Record<Preset, { container: Variants; item: Variants }> = {
  blur: {
    container: {},
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
  },
  'fade-in-blur': {
    container: {},
    item: {
      hidden: { opacity: 0, y: -6, filter: 'blur(4px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    },
  },
  scale: {
    container: {},
    item: {
      hidden: { opacity: 0, scale: 0.6 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  fade: {
    container: {},
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  slide: {
    container: {},
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
}

function splitText(text: string, per: 'word' | 'char' | 'line'): string[] {
  if (per === 'line') return text.split('\n')
  if (per === 'char') return text.split('')
  return text.split(/(\s+)/)
}

export function TextEffect({
  children,
  per = 'word',
  as: Tag = 'p',
  preset = 'fade',
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  variants,
  className,
  style,
  segmentWrapperClassName,
  onAnimationComplete,
}: TextEffectProps) {
  const segments = splitText(children, per)
  const chosen = presetVariants[preset]
  const itemVariants: Variants = variants?.item ?? chosen.item

  const staggerChildren = 0.05 / speedReveal
  const segmentDuration = 0.4 / speedSegment

  const containerVariants: Variants = variants?.container ?? {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
    exit: {
      transition: {
        staggerChildren: staggerChildren / 2,
        staggerDirection: -1,
      },
    },
  }

  const MotionTag = motion[Tag as keyof typeof motion] as typeof motion.p

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          className={className}
          style={style}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          onAnimationComplete={onAnimationComplete}
          aria-label={children}
        >
          {segments.map((segment, i) => (
            <motion.span
              key={i}
              variants={itemVariants}
              transition={{ duration: segmentDuration, ease: [0.25, 0.1, 0.25, 1] }}
              className={segmentWrapperClassName}
              style={{ display: per === 'char' ? 'inline-block' : 'inline' }}
            >
              {segment}
            </motion.span>
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  )
}
