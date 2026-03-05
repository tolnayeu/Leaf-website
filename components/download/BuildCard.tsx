'use client'
import { type Build, getDownloadUrl } from '@/lib/leafApi'
import { Download } from 'lucide-react'
import { CanvasRevealEffect } from '@/components/ui/CanvasRevealEffect'
import { StarButton } from '@/components/ui/StarButton'

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

  if (highlight) {
    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-3)',
          border: '1px solid var(--color-accent-border)',
          background: 'var(--color-background-200)',
          marginBottom: '8px',
          overflow: 'hidden',
        }}
      >
        {/* Canvas effect background — radial mask: solid at button, fades outward */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            WebkitMaskImage: 'radial-gradient(ellipse 70% 120% at 88% 50%, black 0%, black 30%, transparent 80%)',
            maskImage: 'radial-gradient(ellipse 70% 120% at 88% 50%, black 0%, black 30%, transparent 80%)',
          }}
        >
          <CanvasRevealEffect
            colors={[[120, 194, 135]]}
            dotSize={2}
            animationSpeed={0.35}
            opacities={[0.4, 0.4, 0.5, 0.5, 0.6, 0.7, 0.8, 0.9, 0.9, 1]}
            showGradient={false}
            containerClassName="h-full w-full"
            originX={0.88}
            originY={0.5}
          />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--color-accent)',
              background: 'var(--color-accent-subtle)',
              border: '1px solid var(--color-accent-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 8px',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            LATEST
          </span>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-fg-300)', margin: '4px 0 0' }}>
            #{build.build}
          </p>
        </div>
        <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-fg-100)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {summary}
          </p>
          <p style={{ margin: '3px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-fg-300)' }}>{date}</p>
        </div>
        {downloadUrl && (
          <StarButton
            href={downloadUrl}
            download
            lightWidth={90}
            duration={2.5}
            className="btn-primary"
            style={{ position: 'relative', zIndex: 1, borderRadius: 'var(--radius)', padding: '6px 14px', height: 'auto' }}
          >
            <Download size={14} />
            Download
          </StarButton>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        border: '1px solid var(--color-border)',
        background: 'transparent',
        marginBottom: '6px',
        transition: 'border-color var(--duration) var(--ease)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-fg-300)', minWidth: '60px' }}>
        #{build.build}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-fg-100)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {summary}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-fg-300)' }}>{date}</p>
      </div>
      {downloadUrl && (
        <a href={downloadUrl} download className="btn-secondary" style={{ padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={13} />
          {filename}
        </a>
      )}
    </div>
  )
}
