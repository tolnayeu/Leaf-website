'use client'
import { useState } from 'react'
import { BenchmarkGraph } from '@/components/docs/BenchmarkGraph'

const TABS = ['Entity Performance', 'Chunk Generation'] as const
type Tab = (typeof TABS)[number]

export function BenchmarkTabs() {
  const [active, setActive] = useState<Tab>('Entity Performance')

  return (
    <div
      style={{
        background: 'var(--color-background-300)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Tab list — OriginUI default segment control style */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          role="tablist"
          style={{
            display: 'inline-flex',
            background: 'var(--color-background-200)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '3px',
            gap: '2px',
          }}
        >
          {TABS.map((tab) => {
            const isActive = tab === active
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(tab)}
                style={{
                  padding: '6px 16px',
                  background: isActive ? 'var(--color-background-300)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-fg-100)' : 'var(--color-fg-200)',
                  fontFamily: 'var(--font-sans)',
                  transition: 'background 150ms ease, color 150ms ease',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.35)' : 'none',
                }}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab panels */}
      <div style={{ padding: '32px 24px' }}>
        {active === 'Entity Performance' && (
          <BenchmarkGraph
            unit="mspt"
            groups={[
              {
                name: 'Default Config',
                bars: [
                  { label: 'Paper', value: 3.7 },
                  { label: 'Leaf', value: 2.8 },
                ],
              },
              {
                name: 'Increased Mob Caps',
                bars: [
                  { label: 'Paper', value: 8.1 },
                  { label: 'Leaf', value: 5.8 },
                  { label: 'Leaf+Async', value: 4.5 },
                ],
              },
            ]}
            improvements={[
              {
                title: 'Default Configuration',
                details: 'Leaf (2.8 mspt) vs Paper (3.7 mspt)',
                percentage: '24.3%',
              },
              {
                title: 'Increased Mob Caps',
                details: 'Leaf (5.8 mspt) vs Paper (8.1 mspt)',
                percentage: '28.4%',
              },
              {
                title: 'Leaf+Async — Best Case',
                details: 'Leaf+Async (4.5 mspt) vs Paper (8.1 mspt)',
                percentage: '44.4%',
                highlight: true,
              },
            ]}
            environment={[
              { label: 'Version', value: '1.21.4' },
              { label: 'CPU', value: 'i7-10750H' },
              { label: 'JVM', value: 'GraalVM 21' },
              { label: 'Memory', value: '6GB' },
            ]}
          />
        )}

        {active === 'Chunk Generation' && (
          <BenchmarkGraph
            unit="s"
            formatAsTime
            groups={[
              {
                name: 'World Generation',
                bars: [
                  { label: 'Paper', value: 517 },
                  { label: 'Leaf', value: 473 },
                ],
              },
            ]}
            improvements={[
              {
                title: 'Chunk Generation Time',
                details: 'Leaf (7:53) vs Paper (8:37)',
                percentage: '8.5%',
                highlight: true,
              },
            ]}
            environment={[
              { label: 'Size', value: '2048 block radius (Chunky)' },
              { label: 'CPU', value: 'i7-10750H' },
              { label: 'JVM', value: 'GraalVM 21' },
              { label: 'Memory', value: '8GB' },
            ]}
          />
        )}
      </div>
    </div>
  )
}
