'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import type { NavConfig } from '@/content/nav'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar({ config }: { config: NavConfig }) {
  const locale = useLocale()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--space-3)',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}
      >
        {/* Logo */}
        <Link
          href={`/${locale}`}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          <Image src="/logo.svg" alt={config.logo.text} width={22} height={22} priority />
        </Link>

        {/* Nav links — hidden on mobile */}
        <div className="nav-links" style={{ display: 'flex', gap: 'var(--space-3)', flex: 1 }}>
          {config.links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              prefetch={link.href.startsWith('/docs') ? false : undefined}
              style={{
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-fg-200)',
                transition: 'color var(--duration) var(--ease)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side — hidden on mobile */}
        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <LanguageSwitcher />
          <a
            href={config.social.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-fg-200)',
              transition: 'color var(--duration) var(--ease)',
            }}
          >
            GitHub
          </a>
          <a
            href={config.social.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '6px 12px' }}
          >
            Discord
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          style={{
            display: 'none',
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-fg-100)',
            padding: '4px',
          }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            background: 'rgba(10,10,10,0.95)',
            padding: 'var(--space-2) var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {config.links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              onClick={() => setOpen(false)}
              style={{
                textDecoration: 'none',
                padding: '10px 0',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-fg-200)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-1)', alignItems: 'center' }}>
            <LanguageSwitcher />
            <a
              href={config.social.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-200)', textDecoration: 'none' }}
            >
              GitHub
            </a>
            <a
              href={config.social.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '6px 12px' }}
            >
              Discord
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
