import { fetchGitHubStars, formatStars } from '@/lib/github'
import { BenchmarkTabs } from './BenchmarkTabs'
import type { HomeConfig } from '@/content/home'
import { ArrowUp, Star } from 'lucide-react'

interface CardDef {
  title: string
  value: string
  badge: string
  comparison: string
  bg: string
  svg: React.ReactNode
  star?: boolean
}

function StatCard({ card }: { card: CardDef }) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: 0,
        background: card.bg,
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {card.svg}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* title */}
        <div
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.60)',
            marginBottom: '14px',
          }}
        >
          {card.title}
        </div>

        {/* value + badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700,
              lineHeight: 1,
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '-0.04em',
            }}
          >
            {card.value}
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(255,255,255,0.14)',
              borderRadius: '999px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            {card.star ? (
              <Star size={10} strokeWidth={2.5} />
            ) : (
              <ArrowUp size={10} strokeWidth={2.5} />
            )}
            {card.badge}
          </div>
        </div>

        {/* comparison */}
        <div
          style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.48)',
            borderTop: '1px solid rgba(255,255,255,0.10)',
            paddingTop: '12px',
            lineHeight: 1.5,
          }}
        >
          {card.comparison}
        </div>
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
      bg: '#0d1f10',
      svg: (
        <svg
          style={{ position: 'absolute', right: 0, top: 0, width: '60%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="160" cy="80" r="80" fill="rgba(120,194,135,0.10)" />
          <circle cx="195" cy="38" r="50" fill="rgba(120,194,135,0.12)" />
          <circle cx="140" cy="165" r="44" fill="rgba(120,194,135,0.07)" />
          <circle cx="195" cy="155" r="24" fill="rgba(120,194,135,0.14)" />
        </svg>
      ),
    },
    {
      title: 'Entity Tick Reduction',
      value: '28.4%',
      badge: 'vs Paper',
      comparison: 'Leaf (5.8 mspt) vs Paper (8.1 mspt) · increased mob caps',
      bg: '#0d1a2e',
      svg: (
        <svg
          style={{ position: 'absolute', right: 0, top: 0, width: '60%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
          viewBox="0 0 200 200"
          fill="none"
        >
          <defs>
            <filter id="blurA" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
          <ellipse cx="170" cy="60" rx="40" ry="18" fill="rgba(100,160,255,0.13)" filter="url(#blurA)" />
          <rect x="120" y="20" width="60" height="20" rx="8" fill="rgba(100,160,255,0.10)" />
          <polygon points="150,0 200,0 200,50" fill="rgba(100,160,255,0.07)" />
          <circle cx="180" cy="110" r="14" fill="rgba(100,160,255,0.16)" />
        </svg>
      ),
    },
    {
      title: 'Faster Chunk Generation',
      value: '8.5%',
      badge: 'vs Paper',
      comparison: 'Leaf (7:53) vs Paper (8:37) · 2048 block radius world',
      bg: '#0a2020',
      svg: (
        <svg
          style={{ position: 'absolute', right: 0, top: 0, width: '60%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
          viewBox="0 0 200 200"
          fill="none"
        >
          <defs>
            <filter id="blurB" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>
          <rect x="120" y="0" width="70" height="70" rx="35" fill="rgba(80,200,180,0.09)" filter="url(#blurB)" />
          <ellipse cx="170" cy="80" rx="28" ry="12" fill="rgba(80,200,180,0.12)" />
          <polygon points="200,0 200,60 140,0" fill="rgba(80,200,180,0.07)" />
          <circle cx="150" cy="30" r="10" fill="rgba(80,200,180,0.15)" />
        </svg>
      ),
    },
    {
      title: 'GitHub Stars',
      value: stars ? `${formatStars(stars)}+` : '2k+',
      badge: 'Open Source',
      comparison: 'Winds-Studio/Leaf · community-driven development',
      bg: '#141414',
      star: true,
      svg: (
        <svg
          style={{ position: 'absolute', right: 0, top: 0, width: '60%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
          viewBox="0 0 200 200"
          fill="none"
        >
          <defs>
            <filter id="blurC" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>
          <polygon points="200,0 200,100 100,0" fill="rgba(255,255,255,0.05)" />
          <ellipse cx="170" cy="40" rx="30" ry="18" fill="rgba(255,255,255,0.08)" filter="url(#blurC)" />
          <rect x="140" y="60" width="40" height="18" rx="8" fill="rgba(255,255,255,0.06)" />
          <circle cx="150" cy="30" r="14" fill="rgba(255,255,255,0.10)" />
          <line x1="120" y1="0" x2="200" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        </svg>
      ),
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
            color: 'var(--color-fg-100)',
            margin: '0 0 12px',
            lineHeight: 1.1,
          }}
        >
          {content.title}
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--color-fg-200)',
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
        {cards.map((card) => (
          <StatCard key={card.title} card={card} />
        ))}
      </div>

      {/* benchmark tabs */}
      <BenchmarkTabs />
    </section>
  )
}
