type Status = 'stable' | 'dev' | 'eol' | 'dead'

const config: Record<Status, { bg: string; text: string; label: string }> = {
  stable: { bg: 'rgba(120,194,135,0.1)', text: 'var(--color-success)', label: 'Stable' },
  dev:    { bg: 'rgba(247,107,21,0.1)',  text: 'var(--color-warning)', label: 'Dev' },
  eol:    { bg: 'rgba(229,72,77,0.1)',   text: 'var(--color-error)',   label: 'EOL' },
  dead:   { bg: 'rgba(102,102,102,0.1)', text: 'var(--color-fg-300)',    label: 'Dead' },
}

export function VersionBadge({ status }: { status: Status }) {
  const c = config[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '2px 10px', borderRadius: '100px',
      background: c.bg, color: c.text, fontSize: '12px', fontWeight: 500,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.text }} />
      {c.label}
    </span>
  )
}
