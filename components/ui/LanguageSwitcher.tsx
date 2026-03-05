'use client'
import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'
import { routing } from '@/i18n/routing'

const localeLabels: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  tr: 'Türkçe',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function switchLocale(next: string) {
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: 'var(--color-fg-200)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '6px',
          fontFamily: 'var(--font-sans)',
          transition: 'color 150ms ease',
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe size={14} strokeWidth={1.5} />
        <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.02em' }}>
          {locale.toUpperCase()}
        </span>
        <ChevronDown
          size={12}
          strokeWidth={2}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 150ms ease',
          }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: '148px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background-300)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            zIndex: 100,
            padding: '4px',
          }}
        >
          {routing.locales.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={l === locale}
              onClick={() => switchLocale(l)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px 10px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: l === locale ? 'var(--color-accent-subtle)' : 'transparent',
                color: l === locale ? 'var(--color-accent)' : 'var(--color-fg-200)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '11px', minWidth: '22px', color: l === locale ? 'var(--color-accent)' : 'var(--color-fg-300)' }}>
                {l.toUpperCase()}
              </span>
              <span>{localeLabels[l] ?? l}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
