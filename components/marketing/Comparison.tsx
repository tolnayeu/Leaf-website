import type { HomeConfig } from '@/content/home'

function Dots({ count }: { count: number }) {
  return (
    <span style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: i <= count ? 'var(--brand)' : 'var(--border-hover)',
            display: 'inline-block',
          }}
        />
      ))}
    </span>
  )
}

export function Comparison({ content }: { content: HomeConfig['comparison'] }) {
  const comparison = content

  return (
    <section style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '40px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
        {comparison.title}
      </h2>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '48px' }}>
        {comparison.subtitle}
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border-default)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: 'var(--bg-card)' }}>
            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--border-default)' }} />
            {comparison.columns.map((col) => (
              <th
                key={col}
                style={{
                  padding: '16px 24px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: col === 'Leaf' ? 'var(--brand)' : 'var(--text-secondary)',
                  borderBottom: '1px solid var(--border-default)',
                  borderLeft: '1px solid var(--border-default)',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row, i) => (
            <tr key={row.label} style={{ background: i % 2 === 0 ? 'var(--bg-page)' : 'var(--bg-card)' }}>
              <td style={{ padding: '14px 24px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'left' }}>
                {row.label}
              </td>
              {[row.paper, row.purpur, row.leaf].map((val, j) => (
                <td key={j} style={{ padding: '14px 24px', borderLeft: '1px solid var(--border-default)' }}>
                  <Dots count={val} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
