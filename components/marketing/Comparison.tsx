import type { HomeConfig } from '@/content/home'

type Score = 1 | 2 | 3

function ScoreIcon({ value }: { value: Score }) {
  if (value === 3) {
    return (
      <span style={{ color: 'var(--brand)', fontSize: '16px', fontWeight: 700, lineHeight: 1 }}>
        ✓
      </span>
    )
  }
  if (value === 2) {
    return (
      <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500, lineHeight: 1 }}>
        Partial
      </span>
    )
  }
  return (
    <span style={{ color: 'var(--border-hover)', fontSize: '16px', lineHeight: 1 }}>
      —
    </span>
  )
}

export function Comparison({ content }: { content: HomeConfig['comparison'] }) {
  const { title, subtitle, columns, rows } = content

  // Map column names to their row values
  const colKeys = ['paper', 'purpur', 'leaf'] as const

  return (
    <section
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px 96px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div
          style={{
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--brand)',
            marginBottom: '12px',
          }}
        >
          Comparison
        </div>
        <h2
          style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            margin: '0 0 12px',
            lineHeight: 1.1,
          }}
        >
          {title}
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
          {subtitle}
        </p>
      </div>

      {/* Comparison grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `220px repeat(${columns.length}, 1fr)`,
          border: '1px solid var(--border-default)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Header row */}
        <div
          style={{
            padding: '16px 24px',
            background: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border-default)',
          }}
        />
        {columns.map((col) => {
          const isLeaf = col === 'Leaf'
          return (
            <div
              key={col}
              style={{
                padding: '16px 24px',
                textAlign: 'center',
                background: isLeaf ? 'rgba(120,194,135,0.06)' : 'var(--bg-elevated)',
                borderLeft: '1px solid var(--border-default)',
                borderBottom: '1px solid var(--border-default)',
                position: 'relative',
              }}
            >
              {isLeaf && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--brand)',
                  }}
                />
              )}
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: isLeaf ? 'var(--brand)' : 'var(--text-secondary)',
                }}
              >
                {col}
              </div>
              {isLeaf && (
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'var(--brand)',
                    opacity: 0.7,
                    marginTop: '2px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Recommended
                </div>
              )}
            </div>
          )
        })}

        {/* Data rows */}
        {rows.map((row, i) => {
          const isLast = i === rows.length - 1
          return (
            <>
              <div
                key={`label-${row.label}`}
                style={{
                  padding: '16px 24px',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  background: i % 2 === 0 ? 'var(--bg-page)' : 'var(--bg-card)',
                  borderBottom: isLast ? 'none' : '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {row.label}
              </div>
              {colKeys.map((key, j) => {
                const val = row[key] as Score
                const isLeaf = columns[j] === 'Leaf'
                return (
                  <div
                    key={`${row.label}-${key}`}
                    style={{
                      padding: '16px 24px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isLeaf
                        ? i % 2 === 0 ? 'rgba(120,194,135,0.04)' : 'rgba(120,194,135,0.07)'
                        : i % 2 === 0 ? 'var(--bg-page)' : 'var(--bg-card)',
                      borderLeft: '1px solid var(--border-default)',
                      borderBottom: isLast ? 'none' : '1px solid var(--border-default)',
                    }}
                  >
                    <ScoreIcon value={val} />
                  </div>
                )
              })}
            </>
          )
        })}
      </div>
    </section>
  )
}
