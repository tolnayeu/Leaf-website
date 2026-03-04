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
          border: '1px solid rgba(120,194,135,0.2)',
          borderRadius: '16px',
          padding: '64px 48px',
          textAlign: 'center',
          background: 'var(--bg-card)',
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
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, var(--bg-card) 80%)',
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
                filter: 'drop-shadow(0 0 12px rgba(120,194,135,0.7)) drop-shadow(0 0 28px rgba(120,194,135,0.3))',
              }}
            />
          </div>

          <h2 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            {community.headline}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
            {community.subheadline}
          </p>
          <a
            href={community.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 28px',
              background: 'linear-gradient(135deg, #78c287 0%, #5a922c 100%)',
              color: '#000',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 0 20px rgba(120,194,135,0.3)',
            }}
          >
            {community.cta.label} →
          </a>
        </div>
      </div>
    </section>
  )
}
