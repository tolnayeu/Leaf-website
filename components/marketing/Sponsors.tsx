import Image from 'next/image'
import type { HomeConfig } from '@/content/home'
import { OCBackers } from './OCBackers'

export function Sponsors({ content }: { content: HomeConfig['sponsors'] }) {
  const sponsors = content

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', textAlign: 'center', borderTop: '1px solid var(--border-default)' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
        {sponsors.title}
      </h2>

      <div style={{ marginTop: '40px' }}>
        {sponsors.gold.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Gold</p>
            <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {sponsors.gold.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer">
                  <Image src={s.logo} alt={s.name} width={120} height={40} style={{ objectFit: 'contain' }} />
                </a>
              ))}
            </div>
          </div>
        )}
        {sponsors.silver.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Silver</p>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {sponsors.silver.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer">
                  <Image src={s.logo} alt={s.name} width={80} height={30} style={{ objectFit: 'contain' }} />
                </a>
              ))}
            </div>
          </div>
        )}
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
