'use client'
import { Zap, Plug, Settings, type LucideIcon } from 'lucide-react'
import type { HomeConfig } from '@/content/home'

const iconMap: Record<string, LucideIcon> = { Zap, Plug, Settings }

export function Features({ content }: { content: HomeConfig['features'] }) {
  return (
    <section
      style={{
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          /* shared borders: left edge on container, right+bottom on each cell */
          borderLeft: '1px solid var(--color-border)',
        }}
      >
        {content.map((feature) => {
          const Icon = iconMap[feature.icon] ?? Zap
          return (
            <div
              key={feature.title}
              style={{
                borderRight: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
                padding: 'var(--space-5) var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                transition: 'background var(--duration) var(--ease)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-background-200)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                style={{
                  width: 'fit-content',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px',
                  color: 'var(--color-accent)',
                }}
              >
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    color: 'var(--color-fg-100)',
                    margin: '0 0 var(--space-1)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-fg-200)',
                    lineHeight: 'var(--leading-base)',
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
