'use client'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnnouncementBadge } from './AnnouncementBadge'
import { HeroVisual } from './HeroVisual'
import { TextEffect } from '@/components/ui/TextEffect'
import type { HomeConfig } from '@/content/home'

export function Hero({ content }: { content: HomeConfig['hero'] }) {
  const hero = content

  return (
    <section style={{ borderBottom: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <div
        className="hero-grid"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: 'var(--space-3)',
          paddingRight: 'var(--space-3)',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'var(--space-4)',
          alignItems: 'center',
        }}
      >
        {/* Left — text content */}
        <div className="hero-left" style={{ gridColumn: '1 / 8', paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)', position: 'relative', zIndex: 1 }}>
          {hero.announcement.visible && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0 }}
              style={{ marginBottom: 'var(--space-2)' }}
            >
              <AnnouncementBadge text={hero.announcement.text} href={hero.announcement.href} />
            </motion.div>
          )}

          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-fg-300)', margin: '0 0 var(--space-2)' }}>
            <TextEffect as="span" preset="blur" per="word" delay={0.1}>
              Open Source · Paper Fork
            </TextEffect>
          </p>

          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.04em', color: 'var(--color-fg-100)', margin: '0 0 var(--space-2)' }}>
            <TextEffect as="span" preset="blur" per="word" delay={0.2}>
              {hero.headline}
            </TextEffect>
          </h1>

          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-fg-200)', lineHeight: 'var(--leading-base)', margin: '0 0 var(--space-4)', maxWidth: '420px' }}>
            <TextEffect as="span" preset="blur" per="word" delay={0.5}>
              {hero.subheadline}
            </TextEffect>
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
            style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}
          >
            <Link href={hero.cta.primary.href} className="btn-primary">
              <Download size={14} />
              {hero.cta.primary.label}
            </Link>
            <Link href={hero.cta.secondary.href} prefetch={false} className="btn-secondary">
              {hero.cta.secondary.label} →
            </Link>
          </motion.div>
        </div>

        {/* Right — visual fades in as text animates */}
        <div className="hero-right" style={{ gridColumn: '8 / 13', alignSelf: 'stretch', position: 'relative', zIndex: 0 }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}
