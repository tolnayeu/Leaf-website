'use client'
import { useEffect, useRef, useState } from 'react'
import { type Build, getDownloadUrl } from '@/lib/leafApi'
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect'
import { ShimmerButton } from '@/components/ui/ShimmerButton'

interface Props {
  build: Build
  version: string
  highlight?: boolean
}

export function BuildCard({ build, version, highlight }: Props) {
  const filename = Object.values(build.downloads)[0]?.name
  const downloadUrl = filename ? getDownloadUrl(version, build.build, filename) : null
  const date = new Date(build.time).toLocaleDateString()
  const summary = build.changes[0]?.summary ?? 'No description'

  const cardRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLSpanElement>(null)
  const [originX, setOriginX] = useState(0.88)

  useEffect(() => {
    if (!highlight) return
    function measure() {
      if (!cardRef.current || !btnRef.current) return
      const card = cardRef.current.getBoundingClientRect()
      const btn = btnRef.current.getBoundingClientRect()
      setOriginX((btn.left - card.left + btn.width / 2) / card.width)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(cardRef.current!)
    return () => ro.disconnect()
  }, [highlight, downloadUrl])

  if (highlight) {
    return (
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px 24px',
          border: '1px solid var(--color-accent-border)',
          borderRadius: '10px',
          background: 'var(--color-background-200)',
          marginBottom: '8px',
          overflow: 'hidden',
          cursor: 'default',
        }}
      >
        <CanvasRevealEffect
          colors={[[120, 194, 135], [90, 146, 44], [64, 166, 78]]}
          dotSize={3}
          showGradient
          originX={originX}
          originY={0.5}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
          <div>
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--brand)',
                background: 'var(--color-accent-subtle)',
                border: '1px solid var(--color-accent-border)',
                borderRadius: '4px',
                padding: '2px 8px',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}
            >
              LATEST
            </span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-fg-300)', margin: '4px 0 0' }}>
              #{build.build}
            </p>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--color-fg-100)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {summary}
            </p>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--color-fg-300)' }}>{date}</p>
          </div>
          {downloadUrl && (
            <span ref={btnRef} style={{ display: 'inline-flex', flexShrink: 0 }}>
              <ShimmerButton as="a" href={downloadUrl} download>
                ⬇ Download
              </ShimmerButton>
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 20px',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        background: 'transparent',
        marginBottom: '6px',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-fg-300)', minWidth: '60px' }}>
        #{build.build}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-fg-100)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {summary}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--color-fg-300)' }}>{date}</p>
      </div>
      {downloadUrl && (
        <a
          href={downloadUrl}
          download
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            color: 'var(--color-fg-100)',
            fontSize: '13px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            background: 'transparent',
          }}
        >
          ⬇ {filename}
        </a>
      )}
    </div>
  )
}
