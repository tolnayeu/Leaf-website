'use client'

import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'

interface AnimatedGradientBackgroundProps {
  startingGap?: number
  breathing?: boolean
  gradientColors?: string[]
  gradientStops?: number[]
  animationSpeed?: number
  breathingRange?: number
  topOffset?: number
  bleedBottom?: number
  containerClassName?: string
  style?: React.CSSProperties
}

export function AnimatedGradientBackground({
  startingGap = 110,
  breathing = true,
  gradientColors = [
    '#080808',
    '#0d2211',
    '#1a4a22',
    '#2d6b35',
    '#5a922c',
    '#78c287',
    '#4c7894',
  ],
  gradientStops = [35, 50, 60, 68, 76, 88, 100],
  animationSpeed = 0.02,
  breathingRange = 5,
  topOffset = 0,
  bleedBottom = 0,
  containerClassName = '',
  style = {},
}: AnimatedGradientBackgroundProps) {
  if (gradientColors.length !== gradientStops.length) {
    throw new Error(
      `gradientColors and gradientStops must have the same length. Got ${gradientColors.length} and ${gradientStops.length}.`
    )
  }

  const containerRef = useRef<HTMLDivElement>(null)
  // Store animation state in refs so restarting the effect (e.g. due to prop changes)
  // continues from the current position instead of snapping back to the start.
  const widthRef = useRef(startingGap)
  const widthDirRef = useRef(1)
  const heightVarRef = useRef(0)
  const heightVelRef = useRef(0)
  const opacityRef = useRef(1)

  useEffect(() => {
    let animationFrame: number

    const animate = () => {
      let width = widthRef.current
      let widthDir = widthDirRef.current
      let heightVar = heightVarRef.current
      let heightVel = heightVelRef.current
      let opacity = opacityRef.current
      // Width breathing
      if (width >= startingGap + breathingRange) widthDir = -1
      if (width <= startingGap - breathingRange) widthDir = 1
      if (!breathing) widthDir = 0
      width += widthDir * animationSpeed

      // Opacity: fade out while expanding, fade in while contracting
      const targetOpacity = widthDir >= 0 ? 0.75 : 1.0
      opacity += (targetOpacity - opacity) * 0.008

      // Random height drift
      heightVel += (Math.random() - 0.5) * 0.12
      heightVel *= 0.94
      heightVar += heightVel
      if (heightVar > 12) { heightVar = 12; heightVel *= -0.5 }
      if (heightVar < -12) { heightVar = -12; heightVel *= -0.5 }

      // Persist state back to refs
      widthRef.current = width
      widthDirRef.current = widthDir
      heightVarRef.current = heightVar
      heightVelRef.current = heightVel
      opacityRef.current = opacity

      const height = width + topOffset + heightVar
      const stops = gradientStops
        .map((stop, i) => `${gradientColors[i]} ${stop}%`)
        .join(', ')

      if (containerRef.current) {
        containerRef.current.style.background =
          `radial-gradient(${width}% ${height}% at 50% 20%, ${stops})`
        containerRef.current.style.opacity = String(opacity)
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [startingGap, breathing, gradientColors, gradientStops, animationSpeed, breathingRange, topOffset])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: 'absolute',
        inset: 0,
        bottom: bleedBottom ? -bleedBottom : 0,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
      className={containerClassName}
      aria-hidden="true"
    >
      <div ref={containerRef} style={{ position: 'absolute', inset: 0, ...style }} />
    </motion.div>
  )
}
