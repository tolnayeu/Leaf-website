'use client'

import { Zap, Plug, Settings, type LucideIcon } from 'lucide-react'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import type { HomeConfig } from '@/content/home'

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Plug,
  Settings,
}

export function Features({ content }: { content: HomeConfig['features'] }) {
  const features = content

  return (
    <section style={{ maxWidth: '1200px', margin: '-100px auto 0', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {features.map((feature) => {
          const Icon = iconMap[feature.icon] ?? Zap
          return (
            <li key={feature.title} style={{ minHeight: '200px' }}>
              {/* outer wrapper — rounded border, tight padding for the glow border */}
              <div
                style={{
                  position: 'relative',
                  height: '100%',
                  borderRadius: '12px',
                  border: '1px solid var(--border-default)',
                  padding: '2px',
                }}
              >
                <GlowingEffect
                  spread={40}
                  glow
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                {/* inner card */}
                <div
                  style={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '24px',
                    overflow: 'hidden',
                    borderRadius: '10px',
                    background: 'var(--bg-card)',
                    padding: '28px',
                    boxShadow: '0px 0px 27px 0px rgba(45,45,45,0.3)',
                  }}
                >
                  {/* icon badge */}
                  <div
                    style={{
                      width: 'fit-content',
                      borderRadius: '8px',
                      border: '1px solid var(--border-default)',
                      background: 'var(--bg-elevated)',
                      padding: '8px',
                      color: 'var(--brand)',
                    }}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: 0,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
