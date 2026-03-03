'use client'

import { useEffect, useRef, useCallback } from 'react'

interface CanvasRevealEffectProps {
  colors?: number[][]
  dotSize?: number
  opacities?: number[]
  showGradient?: boolean
  /** Origin of the wave / gradient, as a fraction 0–1. Default 0.5 = center */
  originX?: number
  originY?: number
}

export function CanvasRevealEffect({
  colors = [[120, 194, 135], [90, 146, 44], [64, 166, 78]],
  dotSize = 3,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  showGradient = true,
  originX = 0.5,
  originY = 0.5,
}: CanvasRevealEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    timeRef.current += 0.016
    const t = timeRef.current

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const gap = dotSize + 3
    const cols = Math.ceil(canvas.width / gap)
    const rows = Math.ceil(canvas.height / gap)

    const ox = originX * cols
    const oy = originY * rows
    const maxDist = Math.sqrt(Math.pow(cols, 2) + Math.pow(rows, 2))

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const dist = Math.sqrt(Math.pow(col - ox, 2) + Math.pow(row - oy, 2))
        const wave = Math.sin(dist * 0.4 - t * 3) * 0.5 + 0.5
        const reveal = Math.max(0, 1 - dist / maxDist) * 0.7

        const opacityIdx = Math.floor(wave * (opacities.length - 1))
        const opacity = opacities[opacityIdx] * reveal

        if (opacity < 0.02) continue

        const colorIdx = Math.floor((col + row + Math.floor(t * 2)) % colors.length)
        const [r, g, b] = colors[colorIdx]

        ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`
        ctx.fillRect(col * gap, row * gap, dotSize, dotSize)
      }
    }

    frameRef.current = requestAnimationFrame(draw)
  }, [colors, dotSize, opacities, originX, originY])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    const resize = () => {
      canvas.width = parent.offsetWidth
      canvas.height = parent.offsetHeight
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameRef.current)
      ro.disconnect()
    }
  }, [draw])

  const gradientPos = `${originX * 100}% ${originY * 100}%`

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
      {showGradient && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at ${gradientPos}, transparent 20%, var(--bg-card) 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  )
}
