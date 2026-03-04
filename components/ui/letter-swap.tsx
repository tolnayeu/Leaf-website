'use client'

import { useRef } from 'react'
import { type AnimationOptions, motion, stagger, useAnimate } from 'motion/react'

interface LetterSwapProps {
  label: string
  reverse?: boolean
  transition?: AnimationOptions
  staggerDuration?: number
  staggerFrom?: 'first' | 'last' | 'center' | number
  className?: string
  style?: React.CSSProperties
}

export function LetterSwap({
  label,
  reverse = true,
  transition = { type: 'spring', duration: 0.5 },
  staggerDuration = 0.025,
  staggerFrom = 'first',
  className,
  style,
}: LetterSwapProps) {
  const [scope, animate] = useAnimate()
  const hoveredRef = useRef(false)

  const withStagger = (base: AnimationOptions) => ({
    ...base,
    delay: stagger(staggerDuration, { from: staggerFrom }),
  })

  const hoverStart = () => {
    if (hoveredRef.current) return
    hoveredRef.current = true

    animate('.letter', { y: reverse ? '100%' : '-100%' }, withStagger(transition))
    animate('.letter-clone', { top: '0%' }, withStagger(transition))
  }

  const hoverEnd = () => {
    hoveredRef.current = false

    animate('.letter', { y: 0 }, withStagger(transition))
    animate('.letter-clone', { top: reverse ? '-100%' : '100%' }, withStagger(transition))
  }

  return (
    <motion.span
      ref={scope}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        {label}
      </span>

      {label.split('').map((char, i) => (
        <span key={i} style={{ position: 'relative', display: 'inline-flex', whiteSpace: 'pre' }}>
          <motion.span className="letter" style={{ position: 'relative', top: 0 }}>
            {char}
          </motion.span>
          <motion.span
            className="letter-clone"
            aria-hidden
            style={{ position: 'absolute', top: reverse ? '-100%' : '100%', left: 0 }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
