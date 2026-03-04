'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { HomeConfig } from '@/content/home'
import { useAvatarRow, avatarHoverStyles } from '@/hooks/useAvatarRow'
import { AvatarTooltip } from './AvatarTooltip'

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

const AVATAR_SIZE = 52
const OVERLAP = 16

export function Contributors({ content }: { content: HomeConfig['contributors'] }) {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [tooltip, setTooltip] = useState<string | null>(null)

  const { containerRef, secondRow } = useAvatarRow(contributors, 'login')

  useEffect(() => {
    Promise.all([
      fetchContributors('Winds-Studio/Leaf'),
      fetchContributors('Winds-Studio/Leaf-website'),
    ]).then(([a, b]) => {
      const seen = new Set<string>()
      const deduped = [...a, ...b].filter((c) => {
        if (seen.has(c.login)) return false
        seen.add(c.login)
        return true
      })
      setContributors(deduped)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>Loading contributors…</p>
      </section>
    )
  }

  if (!contributors.length) return null

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '36px' }}>
        {content.title}
      </h2>

      <div
        ref={containerRef}
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', rowGap: '6px' }}
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
                marginLeft: i === 0 ? 0 : -OVERLAP,
                zIndex: isHovered ? 999 : contributors.length - i,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onMouseEnter={() => setTooltip(c.login)}
              onMouseLeave={() => setTooltip(null)}
            >
              <a href={c.html_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>
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
                    ...avatarHoverStyles(isHovered, isSecond),
                  }}
                />
              </a>
              {isHovered && <AvatarTooltip isSecond={isSecond}>{c.login}</AvatarTooltip>}
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
