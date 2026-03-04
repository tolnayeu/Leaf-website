'use client'
import Link from 'next/link'
import { motion } from 'motion/react'
import { AnnouncementBadge } from './AnnouncementBadge'
import { AnimatedGradientBackground } from '@/components/ui/animated-gradient-background'
import { TextEffect } from '@/components/ui/text-effect'
import type { HomeConfig } from '@/content/home'

const fadeDown = (delay: number) => ({
  initial: { opacity: 0, y: -6, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], delay },
})

const GRADIENT_COLORS = ['#080808', '#0d2211', '#1a4a22', '#2d6b35', '#5a922c', '#78c287', '#4c7894']
const GRADIENT_STOPS = [35, 50, 60, 68, 76, 88, 100]

export function Hero({ content }: { content: HomeConfig['hero'] }) {
  const hero = content

  return (
    <section
      style={{
        position: 'relative',
        textAlign: 'center',
        padding: '148px 24px 80px',
        overflow: 'hidden',
      }}
    >
      {/* Gradient — locked inside hero bounds */}
      <AnimatedGradientBackground
        startingGap={110}
        breathing
        gradientColors={GRADIENT_COLORS}
        gradientStops={GRADIENT_STOPS}
        animationSpeed={0.015}
        breathingRange={6}
        bleedBottom={0}
      />

      {/* Radial vignette — circular shading from edges toward center */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            'radial-gradient(ellipse 72% 80% at 50% 42%, transparent 18%, rgba(0,0,0,0.45) 46%, rgba(0,0,0,0.82) 66%, #000 86%)',
            'linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.55) 100%)',
          ].join(', '),
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto' }}>
        {/* Announcement badge */}
        {hero.announcement.visible && (
          <div style={{ marginBottom: '20px' }}>
            <AnnouncementBadge
              text={hero.announcement.text}
              href={hero.announcement.href}
            />
          </div>
        )}

        {/* Headline */}
        <TextEffect
          as="h1"
          per="word"
          preset="fade-in-blur"
          speedReveal={0.9}
          speedSegment={1.2}
          delay={0.1}
          className="text-effect-headline"
          style={{
            fontSize: 'clamp(32px, 5.5vw, 56px)',
            fontWeight: 700,
            lineHeight: 1.08,
            color: 'var(--text-primary)',
            margin: '0 0 16px',
            letterSpacing: '-0.03em',
          }}
        >
          {hero.headline}
        </TextEffect>

        {/* Sub-headline */}
        <TextEffect
          as="p"
          per="word"
          preset="fade-in-blur"
          speedReveal={1.4}
          speedSegment={1.4}
          delay={0.45}
          style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            margin: '0 auto 32px',
            maxWidth: '480px',
          }}
        >
          {hero.subheadline}
        </TextEffect>

        {/* CTA buttons */}
        <motion.div
          {...fadeDown(0.75)}
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          <Link
            href={hero.cta.primary.href}
            className="gradient-btn"
            style={{ padding: '9px 20px', fontSize: '13px' }}
          >
            ▶ {hero.cta.primary.label}
          </Link>
          <Link
            href={hero.cta.secondary.href}
            prefetch={false}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              background: 'transparent',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius)',
              fontWeight: 500,
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            {hero.cta.secondary.label} →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
