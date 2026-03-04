import Image from 'next/image'
import type { HomeConfig } from '@/content/home'
import { OCBackers } from './OCBackers'

const TIERS = [
  { key: 'gold', label: 'Gold', gap: '32px', width: 120, height: 40 },
  { key: 'silver', label: 'Silver', gap: '24px', width: 80, height: 30 },
] as const

export function Sponsors({ content: sponsors }: { content: HomeConfig['sponsors'] }) {
  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', textAlign: 'center', borderTop: '1px solid var(--border-default)' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
        {sponsors.title}
      </h2>

      <div style={{ marginTop: '40px' }}>
        {TIERS.map(({ key, label, gap, width, height }) => {
          const items = sponsors[key]
          if (!items.length) return null
          return (
            <div key={key} style={{ marginBottom: '32px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>{label}</p>
              <div style={{ display: 'flex', gap, justifyContent: 'center', flexWrap: 'wrap' }}>
                {items.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer">
                    <Image src={s.logo} alt={s.name} width={width} height={height} style={{ objectFit: 'contain' }} />
                  </a>
                ))}
              </div>
            </div>
          )
        })}
        <div style={{ marginBottom: '32px' }}>
          <OCBackers />
        </div>
      </div>

      <a
        href={sponsors.cta.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 20px',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
          borderRadius: 'var(--radius)',
          fontSize: '14px',
          fontWeight: 500,
          textDecoration: 'none',
          background: 'transparent',
        }}
      >
        {sponsors.cta.label} →
      </a>
    </section>
  )
}
