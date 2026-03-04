'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import type { NavConfig } from '@/content/nav'
import { LanguageSwitcher } from './LanguageSwitcher'
import { LetterSwap } from './letter-swap'
import { useEffect, useState } from 'react'

export function Navbar({ config }: { config: NavConfig }) {
  const locale = useLocale()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '10px 16px',
      }}
    >
      <nav
        style={{
          maxWidth: scrolled ? '860px' : '920px',
          margin: '0 auto',
          padding: '0 18px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
          background: scrolled ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0.32)',
          border: scrolled
            ? '1px solid var(--border-default)'
            : '1px solid rgba(255,255,255,0.10)',
          borderRadius: '14px',
          transition: [
            'max-width 350ms ease',
            'background 350ms ease',
            'border-color 350ms ease',
            'backdrop-filter 350ms ease',
          ].join(', '),
        }}
      >
        {/* Logo */}
        <Link
          href={`/${locale}`}
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              filter: 'drop-shadow(0 0 6px rgba(120,194,135,0.55)) drop-shadow(0 0 14px rgba(120,194,135,0.25))',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Image
              src="/logo.svg"
              alt={config.logo.text}
              width={24}
              height={24}
              priority
            />
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '18px', flex: 1 }}>
          {config.links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              prefetch={link.href.startsWith('/docs') ? false : undefined}
              style={{ textDecoration: 'none' }}
            >
              <LetterSwap
                label={link.label}
                style={{ fontSize: '13px', color: 'var(--text-secondary)' }}
              />
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LanguageSwitcher />
          <a
            href={config.social.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <LetterSwap
              label="GitHub"
              style={{ fontSize: '13px', color: 'var(--text-secondary)' }}
            />
          </a>
          <a
            href={config.social.discord}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '7px',
              padding: '5px 12px',
              background: 'rgba(255,255,255,0.06)',
            }}
          >
            <LetterSwap
              label="Discord"
              style={{ fontSize: '13px', color: 'var(--text-primary)' }}
            />
          </a>
        </div>
      </nav>
    </header>
  )
}
