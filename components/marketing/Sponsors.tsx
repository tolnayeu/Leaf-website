import Image from 'next/image'
import type { HomeConfig } from '@/content/home'
import { OCBackers } from './OCBackers'

export function Sponsors({ content }: { content: HomeConfig['sponsors'] }) {
  const sponsors = content

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
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          borderLeft: '1px solid var(--color-border)',
        }}
      >
        {/* Left: title + logos + backers */}
        <div
          style={{
            borderRight: '1px solid var(--color-border)',
            padding: 'var(--space-5) var(--space-4)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
              color: 'var(--color-fg-100)',
              margin: '0 0 var(--space-4)',
              letterSpacing: '-0.02em',
            }}
          >
            {sponsors.title}
          </h2>

          {sponsors.gold.length > 0 && (
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>Gold</p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
                {sponsors.gold.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ opacity: 0.7, transition: 'opacity var(--duration) var(--ease)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                  >
                    <Image src={s.logo} alt={s.name} width={120} height={40} style={{ objectFit: 'contain', filter: 'grayscale(100%) brightness(1.4)' }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {sponsors.silver.length > 0 && (
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>Silver</p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                {sponsors.silver.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ opacity: 0.7, transition: 'opacity var(--duration) var(--ease)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                  >
                    <Image src={s.logo} alt={s.name} width={80} height={30} style={{ objectFit: 'contain', filter: 'grayscale(100%) brightness(1.4)' }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          <OCBackers />
        </div>

        {/* Right: CTA */}
        <div
          style={{
            borderRight: '1px solid var(--color-border)',
            padding: 'var(--space-5) var(--space-4)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <a href={sponsors.cta.href} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            {sponsors.cta.label} →
          </a>
        </div>
      </div>
    </section>
  )
}
