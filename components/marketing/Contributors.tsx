'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import type { HomeConfig } from '@/content/home'

interface Contributor {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

async function fetchContributors(repo: string): Promise<Contributor[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=50`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export function Contributors({ content }: { content: HomeConfig['contributors'] }) {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [tooltip, setTooltip] = useState<string | null>(null)
  const [secondRow, setSecondRow] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect which items wrapped to the second row
  const measureRows = useCallback(() => {
    if (!containerRef.current) return
    const children = Array.from(containerRef.current.children) as HTMLElement[]
    if (children.length === 0) return
    const firstTop = children[0].getBoundingClientRect().top
    const next = new Set<string>()
    children.forEach((child) => {
      if (child.getBoundingClientRect().top > firstTop + 4) {
        next.add(child.dataset.login ?? '')
      }
    })
    setSecondRow(next)
  }, [])

  useEffect(() => {
    Promise.all([
      fetchContributors('Winds-Studio/Leaf'),
      fetchContributors('Winds-Studio/Leaf-website'),
    ]).then(([a, b]) => {
      const merged = [...a, ...b]
      const seen = new Set<string>()
      const deduped = merged.filter((c) => {
        if (seen.has(c.login)) return false
        seen.add(c.login)
        return true
      })
      setContributors(deduped)
      setLoading(false)
    })
  }, [])

  // Re-measure whenever contributors change or window resizes
  useEffect(() => {
    if (!containerRef.current) return
    measureRows()
    const ro = new ResizeObserver(measureRows)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [contributors, measureRows])

  if (loading) {
    return (
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>Loading contributors…</p>
      </section>
    )
  }

  if (contributors.length === 0) return null

  const AVATAR_SIZE = 52
  const OVERLAP = 16

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '36px' }}>
        {content.title}
      </h2>

      {/* Avatar group */}
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
        {contributors.map((c, i) => {
          const isSecond = secondRow.has(c.login)
          const isHovered = tooltip === c.login

          return (
            <div
              key={c.login}
              data-login={c.login}
              style={{
                position: 'relative',
                marginLeft: i === 0 ? 0 : `-${OVERLAP}px`,
                zIndex: isHovered ? 999 : contributors.length - i,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onMouseEnter={() => setTooltip(c.login)}
              onMouseLeave={() => setTooltip(null)}
            >
              <a
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex' }}
              >
                <Image
                  src={c.avatar_url}
                  alt={c.login}
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                  style={{
                    borderRadius: '50%',
                    border: '2.5px solid var(--bg-page)',
                    display: 'block',
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    objectFit: 'cover',
                    transition: 'transform 150ms ease',
                    transform: isHovered
                      ? isSecond
                        ? 'translateY(6px) scale(1.1)'
                        : 'translateY(-6px) scale(1.1)'
                      : 'translateY(0) scale(1)',
                    filter: isHovered ? 'drop-shadow(0 4px 12px rgba(120,194,135,0.4))' : 'none',
                  }}
                />
              </a>

              {/* Nametag — above for row 1, below for row 2 */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    ...(isSecond
                      ? { top: 'calc(100% + 8px)' }
                      : { bottom: 'calc(100% + 6px)' }),
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 999,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  {c.login}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
        {contributors.length} contributors across Leaf & website
      </p>
    </section>
  )
}
