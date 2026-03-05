'use client'

import { useState, useEffect, useRef } from 'react'
import NumberFlow from '@number-flow/react'
import { motion } from 'framer-motion'

export interface BenchmarkBar {
  label: string
  value: number
  color?: string
  highlight?: boolean
}

export interface BenchmarkGroup {
  name: string
  bars: BenchmarkBar[]
}

export interface EnvEntry {
  label: string
  value: string
}

export interface BenchmarkGraphProps {
  unit?: string
  formatAsTime?: boolean
  environment?: EnvEntry[]
  codeBlocks?: { title: string; content: string }[]
  groups: BenchmarkGroup[]
  improvements?: { title: string; details: string; percentage: string; highlight?: boolean }[]
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const DEFAULT_COLORS: Record<string, string> = {
  Paper:       '#3b82f6',
  Leaf:        '#78c287',
  'Leaf+Async':'#49b858',
}

function barColor(bar: BenchmarkBar): string {
  if (bar.color) return bar.color
  return DEFAULT_COLORS[bar.label] ?? 'var(--color-accent)'
}


interface BarProps {
  bar: BenchmarkBar
  maxValue: number
  formatAsTime: boolean
  active: boolean
  delay: number
  showTooltip?: boolean
}

const CHART_HEIGHT = 340

function Bar({ bar, maxValue, formatAsTime, active, delay, showTooltip }: BarProps) {
  const pct = Math.round((bar.value / maxValue) * 100)
  const fillPx = Math.round((pct / 100) * CHART_HEIGHT)
  const color = barColor(bar)

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Track */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: CHART_HEIGHT,
          overflow: 'hidden',
          backgroundColor: 'rgba(28,28,28,0.8)',
          backgroundImage: `linear-gradient(135deg, rgba(60,60,60,0.35) 25%, transparent 25.5%, transparent 50%, rgba(60,60,60,0.35) 50.5%, rgba(60,60,60,0.35) 75%, transparent 75.5%, transparent)`,
          backgroundSize: '10px 10px',
        }}
      >
        {/* Bar fill */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: active ? fillPx : 0 }}
          transition={{ duration: 0.8, type: 'spring', damping: 20, delay }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: color,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: 10,
            overflow: 'hidden',
          }}
        >
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '3px 8px',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}>
            {formatAsTime
              ? formatTime(bar.value)
              : <NumberFlow value={bar.value} suffix=" mspt" format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} />
            }
          </div>
        </motion.div>

        {/* "Best" badge */}
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.3, delay: delay + 0.9 }}
            style={{
              position: 'absolute',
              bottom: fillPx + 8,
              left: '50%',
              transform: 'translateX(-50%)',
              background: color,
              color: '#000',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              padding: '2px 8px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            Best
            <span style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: `5px solid ${color}`,
            }} />
          </motion.div>
        )}
      </div>

      {/* Label */}
      <div style={{
        textAlign: 'center',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-fg-300)',
        paddingTop: 8,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {bar.label}
      </div>
    </div>
  )
}

export function BenchmarkGraph({
  unit = 'mspt',
  formatAsTime = false,
  environment,
  codeBlocks,
  groups,
  improvements,
}: BenchmarkGraphProps) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const trigger = () => setActive(true)
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) trigger() },
      { threshold: 0 }
    )
    observer.observe(el)
    // Fallback: if already in viewport on mount
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) trigger()
    return () => observer.disconnect()
  }, [])

  const allValues = groups.flatMap((g) => g.bars.map((b) => b.value))
  const maxValue = Math.max(...allValues, 1)

  // Derive improvement cards
  const cards =
    improvements ??
    groups.flatMap((group) => {
      const baseline = group.bars[0]
      return group.bars.slice(1).map((bar) => {
        const pct = (((baseline.value - bar.value) / baseline.value) * 100).toFixed(1)
        return {
          title: `${bar.label} vs ${baseline.label}`,
          details: `${group.name}`,
          percentage: `${pct}%`,
          highlight: bar.label.toLowerCase().includes('async'),
        }
      })
    })

  return (
    <div ref={ref}>
      {/* Groups as bordered boxes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${groups.length}, 1fr)`,
          borderLeft: '1px solid var(--color-border)',
          borderTop: '1px solid var(--color-border)',
          marginBottom: 'var(--space-3)',
        }}
      >
        {groups.map((group, gi) => (
          <div
            key={group.name}
            style={{
              borderRight: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Group header */}
            <div
              style={{
                padding: 'var(--space-2) var(--space-3)',
                borderBottom: '1px solid var(--color-border)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--color-fg-100)',
                letterSpacing: '-0.01em',
              }}
            >
              {group.name}
            </div>

            {/* Bars */}
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-2)',
                padding: 'var(--space-3)',
              }}
            >
              {group.bars.map((bar, bi) => {
                const delay = (gi * group.bars.length + bi) * 0.15
                const groupMin = Math.min(...group.bars.map((b) => b.value))
                const isMin = bar.value === groupMin
                return (
                  <Bar
                    key={bi}
                    bar={bar}
                    maxValue={maxValue}
                    formatAsTime={formatAsTime}
                    active={active}
                    delay={delay}
                    showTooltip={isMin}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Improvement cards */}
      {cards.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cards.length}, 1fr)`,
            borderLeft: '1px solid var(--color-border)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={active ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
              style={{
                borderRight: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
                padding: 'var(--space-3)',
                background: card.highlight ? 'var(--color-accent-subtle)' : 'transparent',
              }}
            >
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {card.percentage}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-fg-100)', marginTop: '6px' }}>
                {card.title}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-300)', marginTop: '2px' }}>
                {card.details}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
