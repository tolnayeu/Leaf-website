'use client'

import { useEffect, useState } from 'react'
import { LoaderIcon } from 'lucide-react'

const DELAY = 1000   // ms after load before fade starts
const FADE  = 400    // ms fade duration

export function Preloader() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'done'>('visible')

  useEffect(() => {
    const start = () => {
      setTimeout(() => {
        setPhase('fading')
        setTimeout(() => setPhase('done'), FADE)
      }, DELAY)
    }

    if (document.readyState === 'complete') {
      start()
    } else {
      window.addEventListener('load', start, { once: true })
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-background-100)',
        opacity: phase === 'fading' ? 0 : 1,
        transition: `opacity ${FADE}ms ease`,
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
      }}
    >
      <LoaderIcon size={28} className="animate-spin" style={{ color: 'var(--color-fg-300)' }} />
    </div>
  )
}
