'use client'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { AnnouncementBadge } from './AnnouncementBadge'
import { HeroTerminal } from './HeroTerminal'
import type { HomeConfig } from '@/content/home'

export function Hero({ content }: { content: HomeConfig['hero'] }) {
  const hero = content

  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-3)',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 'var(--space-4)',
        alignItems: 'center',
      }}
    >
      {/* Left — cols 1-7 */}
      <div style={{ gridColumn: '1 / 8' }}>
        {hero.announcement.visible && (
          <div className="hero-animate" style={{ marginBottom: 'var(--space-2)' }}>
            <AnnouncementBadge text={hero.announcement.text} href={hero.announcement.href} />
          </div>
        )}

        <p
          className="hero-animate hero-animate-delay-1"
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-fg-300)',
            margin: '0 0 var(--space-2)',
          }}
        >
          Open Source · Paper Fork
        </p>

        <h1
          className="hero-animate hero-animate-delay-2"
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            color: 'var(--color-fg-100)',
            margin: '0 0 var(--space-2)',
          }}
        >
          {hero.headline}
        </h1>

        <p
          className="hero-animate hero-animate-delay-3"
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-fg-200)',
            lineHeight: 'var(--leading-base)',
            margin: '0 0 var(--space-4)',
            maxWidth: '420px',
          }}
        >
          {hero.subheadline}
        </p>

        <div
          className="hero-animate hero-animate-delay-4"
          style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}
        >
          <Link href={hero.cta.primary.href} className="btn-primary">
            <Download size={14} />
            {hero.cta.primary.label}
          </Link>
          <Link href={hero.cta.secondary.href} prefetch={false} className="btn-secondary">
            {hero.cta.secondary.label} →
          </Link>
        </div>
      </div>

      {/* Right — cols 8-12 */}
      <div
        className="hero-animate hero-animate-delay-3"
        style={{ gridColumn: '8 / 13' }}
      >
        <HeroTerminal />
      </div>
    </section>
  )
}
