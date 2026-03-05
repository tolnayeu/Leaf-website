const LINES = [
  { text: '$ java -jar leaf-server.jar --nogui', color: 'var(--color-fg-200)' },
  { text: '' },
  { text: 'Starting Leaf server...', color: 'var(--color-fg-300)' },
  { text: '[Server] Loading libraries, please wait...', color: 'var(--color-fg-300)' },
  { text: '[Server] Environment: Java 21 (OpenJDK 64-Bit)', color: 'var(--color-fg-300)' },
  { text: '' },
  { text: '[Leaf] Async entity tracking: enabled', color: 'var(--color-accent)' },
  { text: '[Leaf] Virtual thread executor: enabled', color: 'var(--color-accent)' },
  { text: '[Leaf] Petal optimizations: enabled', color: 'var(--color-accent)' },
  { text: '' },
  { text: '[Server] Done (1.847s)! For help, type "help"', color: 'var(--color-fg-100)' },
  { text: '> ', color: 'var(--color-fg-200)' },
]

export function HeroTerminal() {
  return (
    <div
      style={{
        background: '#000',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 16px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-background-200)',
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e5484d', flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f76b15', flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#78c287', flexShrink: 0 }} />
        <span
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-fg-300)',
            letterSpacing: '0.04em',
          }}
        >
          leaf-server.jar
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '2px', minHeight: '220px' }}>
        {LINES.map((line, i) =>
          line.text === '' ? (
            <div key={i} style={{ height: '8px' }} />
          ) : (
            <div
              key={i}
              style={{
                fontSize: 'var(--text-xs)',
                lineHeight: 'var(--leading-xs)',
                color: line.color ?? 'var(--color-fg-300)',
                whiteSpace: 'pre',
              }}
            >
              {line.text}
            </div>
          )
        )}
      </div>
    </div>
  )
}
