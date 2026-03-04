import { fetchGitHubStars, formatStars } from '@/lib/github'
import { BenchmarkTabs } from './BenchmarkTabs'
import type { HomeConfig } from '@/content/home'

interface Stat {
  value: string
  label: string
  description: string
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: 0,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: '16px',
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '28px',
          right: '28px',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, rgba(120,194,135,0.5) 50%, transparent)',
        }}
      />

      {/* large number */}
      <div
        style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.2rem)',
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--text-primary)',
          letterSpacing: '-0.04em',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {stat.value}
      </div>

      {/* label */}
      <div
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
        }}
      >
        {stat.label}
      </div>

      {/* description */}
      <div
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
        }}
      >
        {stat.description}
      </div>
    </div>
  )
}

export async function Comparison({ content }: { content: HomeConfig['comparison'] }) {
  const stars = await fetchGitHubStars('Winds-Studio/Leaf')

  const stats: Stat[] = [
    {
      value: '44.4%',
      label: 'MSPT improvement',
      description: 'Leaf+Async vs Paper at 700 mob cap',
    },
    {
      value: '28.4%',
      label: 'Entity tick reduction',
      description: 'Leaf vs Paper with increased mob caps',
    },
    {
      value: '8.5%',
      label: 'Faster chunk generation',
      description: '2048-block radius world, same hardware',
    },
    {
      value: stars ? `${formatStars(stars)}+` : '2k+',
      label: 'GitHub stars',
      description: 'Open-source, community-driven development',
    },
  ]

  return (
    <section
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px 96px',
      }}
    >
      {/* header */}
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
          Performance
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
          {content.title}
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            maxWidth: '460px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {content.subtitle}
        </p>
      </div>

      {/* stat cards */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '32px',
        }}
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* benchmark tabs */}
      <BenchmarkTabs />
    </section>
  )
}
