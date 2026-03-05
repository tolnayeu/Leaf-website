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

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div className={cn('absolute inset-0', blurClass)}>
        {colors.map((color, index) => (
          <svg
            key={index}
            className="absolute animate-background-gradient"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 50}%`,
              '--background-gradient-speed': `${1 / speed}s`,
              '--tx-1': rand(), '--ty-1': rand(),
              '--tx-2': rand(), '--ty-2': rand(),
              '--tx-3': rand(), '--ty-3': rand(),
              '--tx-4': rand(), '--ty-4': rand(),
            } as React.CSSProperties}
            width={circleSize * randInt(0.5, 1.5)}
            height={circleSize * randInt(0.5, 1.5)}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" fill={color} className="opacity-25 dark:opacity-[0.15]" />
          </svg>
        ))}
      </div>
    </div>
  )
}
