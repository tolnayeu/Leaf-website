'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAvatarRow, avatarHoverStyles } from '@/hooks/useAvatarRow'
import { AvatarTooltip } from './AvatarTooltip'

interface OCMember {
  name: string
  image: string | null
  profile: string
  role: string
  isActive: boolean
}

// Module-level cache — shared across mounts in the same session
let _cache: Promise<OCMember[]> | null = null
function fetchOCBackers(): Promise<OCMember[]> {
  if (!_cache) {
    _cache = fetch('https://opencollective.com/Winds-Studio/members/all.json')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: OCMember[]) => data.filter((m) => m.role === 'BACKER' && m.isActive))
      .catch(() => [])
  }
  return _cache
}

const AVATAR_SIZE = 48
const OVERLAP = 14
const AVATAR_BG = '#1a2a1e'

export function OCBackers() {
  const [backers, setBackers] = useState<OCMember[]>([])
  const [loading, setLoading] = useState(true)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [tooltip, setTooltip] = useState<string | null>(null)

  const visibleBackers = backers.filter((b) => b.image && !failedImages.has(b.profile))
  const hiddenBackers = backers.filter((b) => !b.image || failedImages.has(b.profile))

  const { containerRef, secondRow } = useAvatarRow(backers)

  useEffect(() => {
    fetchOCBackers().then((data) => {
      setBackers(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', margin: '16px 0' }}>
        Loading supporters…
      </p>
    )
  }

  if (!backers.length) return null

  const overflowKey = '__others__'
  const overflowIsSecond = secondRow.has(overflowKey)
  const overflowHovered = tooltip === overflowKey

  return (
    <div>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
        Supporters
      </p>

      <div
        ref={containerRef}
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', rowGap: '6px' }}
      >
        {visibleBackers.map((b, i) => {
          const isSecond = secondRow.has(b.profile)
          const isHovered = tooltip === b.profile
          return (
            <div
              key={b.profile}
              data-key={b.profile}
              style={{
                position: 'relative',
                marginLeft: i === 0 ? 0 : -OVERLAP,
                zIndex: isHovered ? 999 : visibleBackers.length - i,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onMouseEnter={() => setTooltip(b.profile)}
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
                    border: '2.5px solid var(--bg-page)',
                    display: 'block',
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    objectFit: 'cover',
                    background: AVATAR_BG,
                    ...avatarHoverStyles(isHovered, isSecond),
                  }}
                />
              </a>
              {isHovered && <AvatarTooltip isSecond={isSecond}>{b.name}</AvatarTooltip>}
            </div>
          )
        })}

        {hiddenBackers.length > 0 && (
          <div
            data-key={overflowKey}
            style={{
              position: 'relative',
              marginLeft: visibleBackers.length === 0 ? 0 : -OVERLAP,
              zIndex: overflowHovered ? 999 : 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onMouseEnter={() => setTooltip(overflowKey)}
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
                border: '2.5px solid var(--bg-page)',
                background: AVATAR_BG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'transform 150ms ease',
                transform: overflowHovered
                  ? overflowIsSecond ? 'translateY(6px) scale(1.1)' : 'translateY(-6px) scale(1.1)'
                  : 'translateY(0) scale(1)',
              }}
            >
              +{hiddenBackers.length}
            </a>
            {overflowHovered && (
              <AvatarTooltip isSecond={overflowIsSecond}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                  {hiddenBackers.map((hb) => <span key={hb.profile}>{hb.name}</span>)}
                </div>
              </AvatarTooltip>
            )}
          </div>
        )}
      </div>

      <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
        {backers.length} supporters on OpenCollective
      </p>
    </div>
  )
}
