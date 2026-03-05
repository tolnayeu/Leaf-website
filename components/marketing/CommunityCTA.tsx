import Image from 'next/image'
import { FlickeringGrid } from '@/components/ui/flickering-grid'
import type { HomeConfig } from '@/content/home'

export function CommunityCTA({ content }: { content: HomeConfig['community'] }) {
  const community = content
  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
      <div
        style={{
          position: 'relative',
          border: '1px solid var(--color-accent-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '64px 48px',
          textAlign: 'center',
          background: 'var(--color-background-200)',
          overflow: 'hidden',
        }}
      >
        {/* Flickering grid background */}
        <FlickeringGrid
          squareSize={4}
          gridGap={6}
          flickerChance={0.25}
          color="rgb(120, 194, 135)"
          maxOpacity={0.18}
        />

        {/* Radial fade to hide grid at edges */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, var(--color-background-200) 80%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Leaf logo with glow */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            <Image
              src="/logo.svg"
              alt="Leaf"
              width={56}
              height={56}
              style={{
                filter: 'drop-shadow(0 0 12px rgba(120, 194, 135, 0.55)) drop-shadow(0 0 28px rgba(120, 194, 135, 0.3))',
              }}
            />
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--color-fg-100)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            {community.headline}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--color-fg-200)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
            {community.subheadline}
          </p>
          <a
            href={community.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="community-cta-btn"
          >
            {community.cta.label} →
          </a>
        </div>
      </div>
    </section>
  )
}
