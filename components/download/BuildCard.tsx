'use client'
import { type Build, getDownloadUrl } from '@/lib/leafApi'

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
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-3)',
          border: '1px solid var(--color-accent-border)',
          borderRadius: 'var(--radius)',
          background: 'var(--color-background-200)',
          marginBottom: '8px',
        }}
      >
        <div>
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
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-fg-100)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {summary}
          </p>
          <p style={{ margin: '3px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-fg-300)' }}>{date}</p>
        </div>
        {downloadUrl && (
          <a href={downloadUrl} download className="btn-primary">
            ⬇ Download
          </a>
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
        borderRadius: 'var(--radius)',
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
        <a href={downloadUrl} download className="btn-secondary" style={{ padding: '5px 12px' }}>
          ⬇ {filename}
        </a>
      )}
    </div>
  )
}
