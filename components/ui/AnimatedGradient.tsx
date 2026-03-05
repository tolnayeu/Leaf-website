'use client'
import React, { useMemo, useRef, useState, useEffect, type RefObject } from 'react'
import { cn } from '@/lib/utils'

function useDimensions(ref: RefObject<HTMLElement | null>): { width: number; height: number } {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    const update = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }
    const debounced = () => { clearTimeout(timeoutId); timeoutId = setTimeout(update, 250) }
    update()
    window.addEventListener('resize', debounced)
    return () => { window.removeEventListener('resize', debounced); clearTimeout(timeoutId) }
  }, [ref])

  return dimensions
}

const rand = () => Math.random() - 0.5
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

interface BlobConfig {
  top: number
  left: number
  tx1: number; ty1: number
  tx2: number; ty2: number
  tx3: number; ty3: number
  tx4: number; ty4: number
  sizeMultiplier: number
}

interface AnimatedGradientProps {
  colors: string[]
  speed?: number
  blur?: 'light' | 'medium' | 'heavy'
}

export function AnimatedGradient({ colors, speed = 5, blur = 'light' }: AnimatedGradientProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef)
  const circleSize = useMemo(
    () => Math.max(dimensions.width, dimensions.height),
    [dimensions.width, dimensions.height]
  )
  const blurClass = blur === 'light' ? 'blur-2xl' : blur === 'medium' ? 'blur-3xl' : 'blur-[100px]'

  // Generate random configs only on the client, after mount
  const [blobs, setBlobs] = useState<BlobConfig[]>([])
  useEffect(() => {
    setBlobs(colors.map(() => ({
      top: Math.random() * 50,
      left: Math.random() * 50,
      tx1: rand(), ty1: rand(),
      tx2: rand(), ty2: rand(),
      tx3: rand(), ty3: rand(),
      tx4: rand(), ty4: rand(),
      sizeMultiplier: randInt(0.5, 1.5) + Math.random() * 0.5,
    })))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.length])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div className={cn('absolute inset-0', blurClass)}>
        {blobs.map((blob, index) => (
          <svg
            key={index}
            className="absolute animate-background-gradient"
            style={{
              top: `${blob.top}%`,
              left: `${blob.left}%`,
              '--background-gradient-speed': `${1 / speed}s`,
              '--tx-1': blob.tx1, '--ty-1': blob.ty1,
              '--tx-2': blob.tx2, '--ty-2': blob.ty2,
              '--tx-3': blob.tx3, '--ty-3': blob.ty3,
              '--tx-4': blob.tx4, '--ty-4': blob.ty4,
            } as React.CSSProperties}
            width={circleSize * blob.sizeMultiplier}
            height={circleSize * blob.sizeMultiplier}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" fill={colors[index]} className="opacity-25 dark:opacity-[0.15]" />
          </svg>
        ))}
      </div>
    </div>
  )
}
