'use client'

import { useState, useId, useRef, useCallback, useLayoutEffect } from 'react'

// Logo colors: #249c5f → #39b54a → #7acca8 → #8fc69d
const GRADIENT_STOPS = [
  { offset: '0%', color: '#249c5f' },
  { offset: '33%', color: '#39b54a' },
  { offset: '66%', color: '#7acca8' },
  { offset: '100%', color: '#8fc69d' },
]

const FONT_ATTRS = {
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: '700',
  fontSize: '76',
}

const PAD = 2 // stroke padding so edges aren't clipped

export function TextHoverEffect({ text }: { text: string }) {
  const id = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<SVGTextElement>(null)
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null)
  const [vb, setVb] = useState({ x: -PAD, y: -PAD, w: 300 + PAD * 2, h: 76 + PAD * 2 })

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return
    try {
      const { x, y, width, height } = el.getBBox()
      setVb({ x: x - PAD, y: y - PAD, w: width + PAD * 2, h: height + PAD * 2 })
    } catch {}
  }, [text])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const handleMouseLeave = useCallback(() => setMouse(null), [])

  const viewBox = `${vb.x} ${vb.y} ${vb.w} ${vb.h}`

  const svgProps = {
    width: '100%',
    height: '100%',
    viewBox,
    preserveAspectRatio: 'xMidYMid meet' as const,
    xmlns: 'http://www.w3.org/2000/svg',
    style: { display: 'block', userSelect: 'none' as const },
  }

  const spotlightMask = mouse
    ? `radial-gradient(circle 90px at ${mouse.x}px ${mouse.y}px, white 0%, rgba(255,255,255,0.1) 80%, transparent 100%)`
    : undefined

  return (
    <>
      {/* Hidden SVG to measure natural text dimensions */}
      <svg width="0" height="0" style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}>
        <text ref={measureRef} {...FONT_ATTRS} x="0" y="0">{text}</text>
      </svg>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ position: 'relative', width: '100%', aspectRatio: `${vb.w}/${vb.h}` }}
      >
        {/* Grey outline — always visible */}
        <svg {...svgProps} style={{ ...svgProps.style, position: 'absolute', inset: 0 }}>
          <text {...FONT_ATTRS} x="0" y="0" fill="none" stroke="rgba(180,180,180,0.35)" strokeWidth="0.5">
            {text}
          </text>
        </svg>

        {/* Gradient outline — masked to spotlight around cursor */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: mouse ? 1 : 0,
            WebkitMaskImage: spotlightMask,
            maskImage: spotlightMask,
          }}
        >
          <svg {...svgProps}>
            <defs>
              <linearGradient id={`lg-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                {GRADIENT_STOPS.map((s) => (
                  <stop key={s.offset} offset={s.offset} stopColor={s.color} />
                ))}
              </linearGradient>
            </defs>
            <text {...FONT_ATTRS} x="0" y="0" fill="none" stroke={`url(#lg-${id})`} strokeWidth="0.5">
              {text}
            </text>
          </svg>
        </div>
      </div>
    </>
  )
}
