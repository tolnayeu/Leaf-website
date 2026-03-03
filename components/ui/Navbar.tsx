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
    const handler = () => setScrolled(window.scrollY > 8)
    handler() // sync initial state
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(0,0,0,0.55)',
        borderBottom: scrolled
          ? '1px solid var(--border-default)'
          : '1px solid transparent',
        transition: `border-color var(--duration) var(--ease)`,
      }}
    >
      <nav
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        {/* Logo */}
        <Link
          href={`/${locale}`}
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
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
              width={32}
              height={32}
              priority
            />
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
          {config.links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              prefetch={link.href.startsWith('/docs') ? false : undefined}
              style={{ textDecoration: 'none' }}
            >
              <LetterSwap
                label={link.label}
                style={{ fontSize: '14px', color: 'var(--text-secondary)' }}
              />
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LanguageSwitcher />
          <a
            href={config.social.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <LetterSwap
              label="GitHub"
              style={{ fontSize: '14px', color: 'var(--text-secondary)' }}
            />
          </a>
          <a
            href={config.social.discord}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius)',
              padding: '6px 14px',
            }}
          >
            <LetterSwap
              label="Discord"
              style={{ fontSize: '14px', color: 'var(--text-primary)' }}
            />
          </a>
        </div>
      </nav>
    </header>
  )
}
