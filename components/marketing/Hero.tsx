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

// Defined outside the component so array references are stable across re-renders.
// Inline literals would create new references on every render, causing the
// AnimatedGradientBackground useEffect to restart and reset the animation.
const GRADIENT_COLORS = ['#080808', '#0d2211', '#1a4a22', '#2d6b35', '#5a922c', '#78c287', '#4c7894']
const GRADIENT_STOPS = [35, 50, 60, 68, 76, 88, 100]

export function Hero({ content }: { content: HomeConfig['hero'] }) {
  const hero = content

  return (
    <section
      style={{
        position: 'relative',
        textAlign: 'center',
        padding: '120px 24px 80px',
      }}
    >
      <AnimatedGradientBackground
        startingGap={110}
        breathing
        gradientColors={GRADIENT_COLORS}
        gradientStops={GRADIENT_STOPS}
        animationSpeed={0.015}
        breathingRange={6}
        bleedBottom={80}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
        {/* Announcement badge */}
        {hero.announcement.visible && (
          <div style={{ marginBottom: '24px' }}>
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
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: 700,
            lineHeight: 1.05,
            color: 'var(--text-primary)',
            margin: '0 0 24px',
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
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: '0 auto 40px',
            maxWidth: '560px',
          }}
        >
          {hero.subheadline}
        </TextEffect>

        {/* CTA buttons */}
        <motion.div
          {...fadeDown(0.75)}
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '0',
          }}
        >
          <Link
            href={hero.cta.primary.href}
            className="gradient-btn"
            style={{ padding: '10px 24px', fontSize: '14px' }}
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
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius)',
              fontWeight: 500,
              fontSize: '14px',
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
