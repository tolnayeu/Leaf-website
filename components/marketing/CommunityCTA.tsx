import type { HomeConfig } from '@/content/home'
import { WarpBackground } from '@/components/ui/WarpBackground'

export function CommunityCTA({ content }: { content: HomeConfig['community'] }) {
  const community = content
  return (
    <section
      style={{
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'var(--space-8) var(--space-3)',
        }}
      >
        <WarpBackground
          beamsPerSide={4}
          beamSize={5}
          beamDuration={4}
          beamDelayMax={4}
          className="community-warp"
          style={{
            border: '1px solid var(--color-border)',
            padding: '64px 48px',
            textAlign: 'center',
            background: 'var(--color-background-200)',
          }}
        >
          <p
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Community
          </p>
          <h2
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 600,
              color: 'var(--color-fg-100)',
              margin: '0 0 var(--space-2)',
              letterSpacing: '-0.03em',
            }}
          >
            {community.headline}
          </h2>
          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-fg-200)',
              maxWidth: '400px',
              margin: '0 auto var(--space-4)',
              lineHeight: 'var(--leading-base)',
            }}
          >
            {community.subheadline}
          </p>
          <a
            href={community.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            {community.cta.label} →
          </a>
        </WarpBackground>
      </div>
    </section>
  )
}
