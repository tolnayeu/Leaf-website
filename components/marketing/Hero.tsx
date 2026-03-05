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

// Logo colors: #39b54a (vivid green), #7acca8 (mint), #249c5f (dark teal), #8fc69d (sage)
// Mixed bands: black → dark teal → vivid green → mixed → mint → sage
const GRADIENT_COLORS = ['#000000', '#061a0c', '#249c5f', '#39b54a', '#5ec878', '#7acca8', '#8fc69d']
const GRADIENT_STOPS = [8, 28, 44, 57, 70, 84, 100]

export function Hero({ content }: { content: HomeConfig['hero'] }) {
  const hero = content

  return (
    <section
      style={{
        position: 'relative',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '96px 24px 48px',
        overflow: 'hidden',
      }}
    >
      {/* Full-coverage gradient — visible at all edges */}
      <AnimatedGradientBackground
        startingGap={125}
        topOffset={35}
        breathing
        gradientColors={GRADIENT_COLORS}
        gradientStops={GRADIENT_STOPS}
        animationSpeed={0.012}
        breathingRange={10}
        bleedBottom={0}
      />

      {/* Dark oval vignette — centered in upper area, gradient fully visible at sides & bottom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 68% 52% at 50% 28%, rgba(0,0,0,0.97) 12%, rgba(0,0,0,0.94) 28%, rgba(0,0,0,0.76) 46%, rgba(0,0,0,0.22) 62%, transparent 78%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', width: '100%' }}>
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
            className="ghost-btn"
          >
            {hero.cta.secondary.label} →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
