'use client'

import { useEffect, useRef, useCallback } from 'react'

interface FlickeringGridProps {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  maxOpacity?: number
  className?: string
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(120, 194, 135)',
  maxOpacity = 0.35,
  className,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)

  const toRgba = useCallback(
    (opacity: number) => {
      const match = color.match(/\d+/g)
      if (!match) return `rgba(120,194,135,${opacity})`
      const [r, g, b] = match
      return `rgba(${r},${g},${b},${opacity})`
    },
    [color]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const step = squareSize + gridGap

    let cols: number
    let rows: number
    let opacities: Float32Array

    function resize() {
      const parent = canvas!.parentElement
      if (!parent) return
      canvas!.width = parent.offsetWidth
      canvas!.height = parent.offsetHeight
      cols = Math.ceil(canvas!.width / step)
      rows = Math.ceil(canvas!.height / step)
      opacities = new Float32Array(cols * rows).fill(0)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < opacities.length; i++) {
        if (Math.random() < flickerChance * 0.1) {
          opacities[i] = Math.random() * maxOpacity
        }

        if (opacities[i] < 0.01) continue

        const col = i % cols
        const row = Math.floor(i / cols)
        ctx.fillStyle = toRgba(opacities[i])
        ctx.beginPath()
        ctx.roundRect(
          col * step,
          row * step,
          squareSize,
          squareSize,
          1
        )
        ctx.fill()
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameRef.current)
      ro.disconnect()
    }
  }, [squareSize, gridGap, flickerChance, maxOpacity, toRgba])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
