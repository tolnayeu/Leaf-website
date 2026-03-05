'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FlickeringGrid } from '@/components/ui/FlickeringGrid'

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    ro.observe(el)
    const { width, height } = el.getBoundingClientRect()
    setSize({ width, height })
    return () => ro.disconnect()
  }, [])

  return (
    <motion.div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.15 }}
    >
      {size.width > 0 && (
        <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.08) translateX(28px)', transformOrigin: 'center right' }}>
          {/* Ambient dots */}
          <FlickeringGrid
            width={size.width}
            height={size.height}
            color="rgb(120,194,135)"
            maxOpacity={0.45}
            squareSize={3}
            gridGap={4}
            flickerChance={0.25}
            style={{ position: 'absolute', inset: 0 }}
          />

          {/* Left-side fade */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, #0a0a0a 0%, transparent 35%)',
              pointerEvents: 'none',
            }}
          />

          {/* Logo-engraved bright layer — same size as ambient so squares line up */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              WebkitMaskImage: 'url(/logo.svg)',
              maskImage: 'url(/logo.svg)',
              maskSize: '75% auto',
              maskPosition: 'center',
              maskRepeat: 'no-repeat',
            }}
          >
            <FlickeringGrid
              width={size.width}
              height={size.height}
              color="rgb(120,194,135)"
              maxOpacity={1}
              squareSize={3}
              gridGap={4}
              flickerChance={0.5}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
