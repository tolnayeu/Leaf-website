'use client'

import { useEffect, useState, type ReactNode } from 'react'

const DELAY = 1000 // must match Preloader DELAY

export function GatedContent({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const start = () => setTimeout(() => setReady(true), DELAY)
    if (document.readyState === 'complete') {
      start()
    } else {
      window.addEventListener('load', start, { once: true })
    }
  }, [])

  // `key` forces remount of all children when ready, replaying framer-motion animations.
  // While waiting: visibility:hidden keeps content out of view (preloader covers it anyway).
  return (
    <div key={ready ? 'ready' : 'loading'} style={ready ? {} : { visibility: 'hidden' }}>
      {children}
    </div>
  )
}
