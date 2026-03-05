'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'

interface OCMember {
  name: string
  image: string | null
  profile: string
  role: string
  isActive: boolean
}

async function fetchOCBackers(): Promise<OCMember[]> {
  try {
    const res = await fetch('https://opencollective.com/Winds-Studio/members/all.json')
    if (!res.ok) return []
    const data: OCMember[] = await res.json()
    return data.filter((m) => m.role === 'BACKER' && m.isActive)
  } catch {
    return []
  }
}

const AVATAR_SIZE = 48
const OVERLAP = 14
const AVATAR_BG = '#1a2a1e'

export function OCBackers() {
  const [backers, setBackers] = useState<OCMember[]>([])
  const [loading, setLoading] = useState(true)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [tooltip, setTooltip] = useState<string | null>(null)
  const [secondRow, setSecondRow] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  const measureRows = useCallback(() => {
    if (!containerRef.current) return
    const children = Array.from(containerRef.current.children) as HTMLElement[]
    if (children.length === 0) return
    const firstTop = children[0].getBoundingClientRect().top
    const next = new Set<string>()
    children.forEach((child) => {
      if (child.getBoundingClientRect().top > firstTop + 4) {
        next.add(child.dataset.key ?? '')
      }
    })
    setSecondRow(next)
  }, [])

  useEffect(() => {
    fetchOCBackers().then((data) => {
      setBackers(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    measureRows()
    const ro = new ResizeObserver(measureRows)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [backers, failedImages, measureRows])

  if (loading) {
    return (
      <p style={{ color: 'var(--color-fg-300)', fontSize: '14px', textAlign: 'center', margin: '16px 0' }}>
        Loading supporters…
      </p>
    )
  }

  if (backers.length === 0) return null

  const visibleBackers = backers.filter((b) => b.image && !failedImages.has(b.profile))
  const hiddenBackers = backers.filter((b) => !b.image || failedImages.has(b.profile))
  const allItems = [...visibleBackers, ...(hiddenBackers.length > 0 ? [null] : [])]

  return (
    <div>
      <p style={{ fontSize: '12px', color: 'var(--color-fg-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
        Supporters
      </p>

      <div
        ref={containerRef}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0px',
          rowGap: '6px',
        }}
      >
        {allItems.map((b, i) => {
          // "+N" overflow avatar
          if (b === null) {
            const key = '__others__'
            const isSecond = secondRow.has(key)
            const isHovered = tooltip === key
            return (
              <div
                key={key}
                data-key={key}
                style={{
                  position: 'relative',
                  marginLeft: i === 0 ? 0 : `-${OVERLAP}px`,
                  zIndex: isHovered ? 999 : 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
                onMouseEnter={() => setTooltip(key)}
                onMouseLeave={() => setTooltip(null)}
              >
                <a
                  href="https://opencollective.com/Winds-Studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    borderRadius: '50%',
                    border: '2.5px solid var(--color-background-100)',
                    background: AVATAR_BG,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'transform 150ms ease',
                    transform: isHovered
                      ? isSecond ? 'translateY(6px) scale(1.1)' : 'translateY(-6px) scale(1.1)'
                      : 'translateY(0) scale(1)',
                  }}
                >
                  +{hiddenBackers.length}
                </a>

                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      ...(isSecond ? { top: 'calc(100% + 8px)' } : { bottom: 'calc(100% + 6px)' }),
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--color-background-300)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      color: 'var(--color-fg-100)',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      zIndex: 999,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      textAlign: 'left',
                    }}
                  >
                    {hiddenBackers.map((hb) => (
                      <span key={hb.profile}>{hb.name}</span>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          const key = b.profile
          const isSecond = secondRow.has(key)
          const isHovered = tooltip === key

          return (
            <div
              key={key}
              data-key={key}
              style={{
                position: 'relative',
                marginLeft: i === 0 ? 0 : `-${OVERLAP}px`,
                zIndex: isHovered ? 999 : visibleBackers.length - i,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onMouseEnter={() => setTooltip(key)}
              onMouseLeave={() => setTooltip(null)}
            >
              <a href={b.profile} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', borderRadius: '50%', background: AVATAR_BG }}>
                <Image
                  src={b.image!}
                  alt={b.name}
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                  onError={() => setFailedImages((prev) => new Set(prev).add(b.profile))}
                  style={{
                    borderRadius: '50%',
                    border: '2.5px solid var(--color-background-100)',
                    display: 'block',
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    objectFit: 'cover',
                    background: AVATAR_BG,
                    transition: 'transform 150ms ease',
                    transform: isHovered
                      ? isSecond ? 'translateY(6px) scale(1.1)' : 'translateY(-6px) scale(1.1)'
                      : 'translateY(0) scale(1)',
                    filter: isHovered ? 'drop-shadow(0 4px 12px rgba(120,194,135,0.4))' : 'none',
                  }}
                />
              </a>

              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    ...(isSecond ? { top: 'calc(100% + 8px)' } : { bottom: 'calc(100% + 6px)' }),
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--color-background-300)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '12px',
                    color: 'var(--color-fg-100)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 999,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  {b.name}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--color-fg-300)' }}>
        {backers.length} supporters on OpenCollective
      </p>
    </div>
  )
}
