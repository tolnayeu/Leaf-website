import { fetchGitHubStars, formatStars } from '@/lib/github'
import { BenchmarkTabs } from './BenchmarkTabs'
import type { HomeConfig } from '@/content/home'
import { ArrowUp, Star } from 'lucide-react'

interface CardDef {
  title: string
  value: string
  badge: string
  comparison: string
  star?: boolean
}

function StatCard({ card }: { card: CardDef }) {
  return (
    <div
      style={{
        borderRight: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}
    >
      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-fg-300)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {card.title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, lineHeight: 1, color: 'var(--color-fg-100)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.04em' }}>
          {card.value}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'var(--color-accent-subtle)', border: '1px solid var(--color-accent-border)', borderRadius: '999px', padding: '2px 8px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>
          {card.star ? <Star size={10} strokeWidth={2} /> : <ArrowUp size={10} strokeWidth={2} />}
          {card.badge}
        </div>
      </div>

      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-300)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-1)', lineHeight: 1.5 }}>
        {card.comparison}
      </div>
    </div>
  )
}

export async function Comparison({ content }: { content: HomeConfig['comparison'] }) {
  const stars = await fetchGitHubStars('Winds-Studio/Leaf')

  const cards: CardDef[] = [
    {
      title: 'MSPT Improvement',
      value: '44.4%',
      badge: 'vs Paper',
      comparison: 'Leaf+Async (4.5 mspt) vs Paper (8.1 mspt) · 700 mob cap',
    },
    {
      title: 'Entity Tick Reduction',
      value: '28.4%',
      badge: 'vs Paper',
      comparison: 'Leaf (5.8 mspt) vs Paper (8.1 mspt) · increased mob caps',
    },
    {
      title: 'Faster Chunk Gen',
      value: '8.5%',
      badge: 'vs Paper',
      comparison: 'Leaf (7:53) vs Paper (8:37) · 2048 block radius world',
    },
    {
      title: 'GitHub Stars',
      value: stars ? `${formatStars(stars)}+` : '2k+',
      badge: 'Open Source',
      comparison: 'Winds-Studio/Leaf · community-driven development',
      star: true,
    },
  ]

  return (
    <section
      style={{
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
        <div
          style={{
            padding: 'var(--space-5) var(--space-3)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'baseline',
            gap: 'var(--space-3)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              color: 'var(--color-fg-100)',
              margin: 0,
            }}
          >
            {content.title}
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-300)', margin: 0 }}>
            {content.subtitle}
          </p>
        </div>

        {/* Stat cards — shared-border grid */}
        <div
          className="stat-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderLeft: '1px solid var(--color-border)',
          }}
        >
          {cards.map((card) => (
            <StatCard key={card.title} card={card} />
          ))}
        </div>

        {/* Benchmark tabs */}
        <div style={{ padding: 'var(--space-4) var(--space-3)' }}>
          <BenchmarkTabs />
        </div>
      </div>
    </section>
  )
}
