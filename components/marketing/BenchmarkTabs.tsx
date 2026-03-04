'use client'
import { useState, useRef, useEffect } from 'react'
import { BenchmarkGraph } from '@/components/docs/BenchmarkGraph'

const TABS = ['Entity Performance', 'Chunk Generation'] as const
type Tab = (typeof TABS)[number]

export function BenchmarkTabs() {
  const [active, setActive] = useState<Tab>('Entity Performance')
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const listRef = useRef<HTMLDivElement>(null)

  // Move sliding indicator to the active tab button
  useEffect(() => {
    if (!listRef.current) return
    const btn = listRef.current.querySelector<HTMLButtonElement>('[data-active="true"]')
    if (!btn) return
    const listRect = listRef.current.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    setIndicatorStyle({ left: btnRect.left - listRect.left, width: btnRect.width })
  }, [active])

  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Tab list */}
      <div
        style={{
          borderBottom: '1px solid var(--border-default)',
          padding: '0 24px',
          position: 'relative',
        }}
      >
        <div
          ref={listRef}
          style={{ display: 'flex', gap: '0', position: 'relative' }}
          role="tablist"
        >
          {TABS.map((tab) => {
            const isActive = tab === active
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                data-active={isActive}
                onClick={() => setActive(tab)}
                style={{
                  padding: '14px 20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)',
                  transition: 'color 200ms ease, font-weight 200ms ease',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {tab}
              </button>
            )
          })}

          {/* Sliding underline indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              height: '2px',
              background: 'var(--brand)',
              borderRadius: '2px 2px 0 0',
              transition: 'left 250ms cubic-bezier(0.4,0,0.2,1), width 250ms cubic-bezier(0.4,0,0.2,1)',
            }}
          />
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
