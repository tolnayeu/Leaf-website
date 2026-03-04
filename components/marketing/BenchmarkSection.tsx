import { fetchGitHubStars, formatStars } from '@/lib/github'
import { BenchmarkTabs } from './BenchmarkTabs'

async function StatCard({
  value,
  label,
  sub,
  highlight,
}: {
  value: string
  label: string
  sub?: string
  highlight?: boolean
}) {
  return (
    <div
      style={{
        flex: '1 1 200px',
        background: highlight
          ? 'linear-gradient(135deg, rgba(120,194,135,0.08) 0%, rgba(120,194,135,0.03) 100%)'
          : 'var(--bg-elevated)',
        border: highlight
          ? '1px solid rgba(120,194,135,0.3)'
          : '1px solid var(--border-default)',
        borderRadius: '12px',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {highlight && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(120,194,135,0.6), transparent)',
          }}
        />
      )}
      <div
        style={{
          fontSize: '2.75rem',
          fontWeight: 700,
          lineHeight: 1,
          color: highlight ? 'var(--brand)' : 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '-0.03em',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          lineHeight: 1.4,
        }}
      >
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

export async function BenchmarkSection() {
  const stars = await fetchGitHubStars('Winds-Studio/Leaf')

  return (
    <section
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px 96px',
      }}
    >
      {/* Section header */}
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
          Benchmarks
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
          Built for speed
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Real-world performance numbers measured against Paper on identical hardware.
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '48px',
        }}
      >
        <StatCard
          value="44.4%"
          label="MSPT improvement"
          sub="Leaf+Async vs Paper at 700 mob cap"
          highlight
        />
        <StatCard
          value="8.5%"
          label="Faster chunk generation"
          sub="2048-block radius world, same hardware"
        />
        <StatCard
          value={stars ? `${formatStars(stars)}★` : '2k★'}
          label="GitHub stars"
          sub="Winds-Studio/Leaf"
        />
      </div>

      {/* Benchmark tabs */}
      <BenchmarkTabs />
    </section>
  )
}
