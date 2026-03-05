'use client'

import { useState, useEffect, useRef } from 'react'

// ---------------------------------------------------------------------------
// Data types – matches what the Vue EntityPerformanceGraph / ChunkGenerationGraph
// components embed inline, now surfaced as props so MDX can supply them.
// ---------------------------------------------------------------------------

/** A single bar in the chart. `value` is the raw measurement. */
export interface BenchmarkBar {
  /** Display label below the bar (e.g. "Paper", "Leaf", "Leaf+Async") */
  label: string
  /** Numeric measurement (MSPT, seconds, etc.) */
  value: number
  /** Bar color. Defaults to the brand colour for "Leaf*" bars. */
  color?: string
}

/** One group of bars (e.g. "Default Config" scenario). */
export interface BenchmarkGroup {
  /** Group label shown above the bars */
  name: string
  bars: BenchmarkBar[]
}

/** Key/value pair shown in the environment card. */
export interface EnvEntry {
  label: string
  value: string
}

export interface BenchmarkGraphProps {
  /** Unit label shown in the axis / improvement card, e.g. "mspt" or "s" */
  unit?: string
  /**
   * If true values are formatted as mm:ss (for chunk generation times
   * expressed in seconds). Default false.
   */
  formatAsTime?: boolean
  /** Environment details shown in the collapsible card. */
  environment?: EnvEntry[]
  /** Extra pre-formatted text blocks (JVM flags, moonrise config, …). */
  codeBlocks?: { title: string; content: string }[]
  /** The bar groups to render. */
  groups: BenchmarkGroup[]
  /**
   * Improvement cards shown below the chart.
   * If omitted they are auto-derived from the first two bars of each group
   * (comparing bar[0] vs bar[1..n]).
   */
  improvements?: { title: string; details: string; percentage: string; highlight?: boolean }[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// ---------------------------------------------------------------------------
// Animated counter hook
// ---------------------------------------------------------------------------

function useAnimatedValue(target: number, active: boolean, durationMs = 1400): number {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    startRef.current = null
    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / durationMs, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setValue(target)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [target, active, durationMs])

  return value
}

// ---------------------------------------------------------------------------
// Bar colours
// ---------------------------------------------------------------------------

const DEFAULT_COLORS: Record<string, string> = {
  Paper: '#3498db',
  Leaf: '#78c287',
  'Leaf+Async': '#49b858',
}

function barColor(bar: BenchmarkBar): string {
  if (bar.color) return bar.color
  return DEFAULT_COLORS[bar.label] ?? 'var(--color-accent)'
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function EnvCard({
  environment,
  codeBlocks,
}: {
  environment?: EnvEntry[]
  codeBlocks?: { title: string; content: string }[]
}) {
  const [open, setOpen] = useState(false)
  if (!environment?.length && !codeBlocks?.length) return null
  return (
    <div
      style={{
        backgroundColor: 'var(--color-background-300)',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid var(--color-border)',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'var(--color-fg-100)',
          fontFamily: 'var(--font-sans)',
          fontSize: '1.1rem',
          fontWeight: 600,
        }}
      >
        <span
          style={{
            fontSize: '12px',
            display: 'inline-block',
            transition: 'transform 150ms',
            transform: open ? 'rotate(90deg)' : 'none',
          }}
        >
          ▶
        </span>
        Test Environment
      </button>

      {open && (
        <>
          {environment && environment.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginTop: '16px',
                marginBottom: '16px',
              }}
            >
              {environment.map((e) => (
                <div key={e.label} style={{ fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600, marginRight: '6px' }}>{e.label}:</span>
                  {e.value}
                </div>
              ))}
            </div>
          )}
          {codeBlocks?.map((block) => (
            <div key={block.title} style={{ marginTop: '16px' }}>
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  marginBottom: '8px',
                }}
              >
                {block.title}
              </h4>
              <pre
                style={{
                  backgroundColor: 'var(--color-background-200)',
                  padding: '12px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8em',
                  lineHeight: 1.4,
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: '0',
                }}
              >
                {block.content}
              </pre>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

interface AnimatedBarProps {
  bar: BenchmarkBar
  maxValue: number
  chartHeight: number
  active: boolean
  showLabels: boolean
  unit: string
  formatAsTime: boolean
  delayMs: number
}

function AnimatedBar({
  bar,
  maxValue,
  chartHeight,
  active,
  showLabels,
  unit,
  formatAsTime,
  delayMs,
}: AnimatedBarProps) {
  const animated = useAnimatedValue(bar.value, active, 1400)
  const targetPx = (bar.value / maxValue) * chartHeight
  const color = barColor(bar)

  const displayValue = formatAsTime
    ? formatTime(animated)
    : `${animated.toFixed(1)} ${unit}`

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '70px',
      }}
    >
      {/* wrapper so bar grows upward */}
      <div
        style={{
          height: `${chartHeight}px`,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            width: '60px',
            borderRadius: '4px 4px 0 0',
            transition: `height 1.2s cubic-bezier(0.34,1.56,0.64,1) ${delayMs}ms`,
            height: active ? `${targetPx}px` : '0',
            backgroundColor: color,
          }}
        />
      </div>
      {/* value */}
      <div
        style={{
          fontSize: '0.85rem',
          marginTop: '8px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          opacity: showLabels ? 1 : 0,
          transform: showLabels ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity 0.5s ease ${delayMs + 200}ms, transform 0.5s ease ${delayMs + 200}ms`,
        }}
      >
        {displayValue}
      </div>
      {/* name */}
      <div
        style={{
          fontSize: '0.85rem',
          marginTop: '4px',
          opacity: showLabels ? 0.8 : 0,
          transform: showLabels ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity 0.5s ease ${delayMs + 250}ms, transform 0.5s ease ${delayMs + 250}ms`,
          textAlign: 'center',
        }}
      >
        {bar.label}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function BenchmarkGraph({
  unit = 'mspt',
  formatAsTime = false,
  environment,
  codeBlocks,
  groups,
  improvements,
}: BenchmarkGraphProps) {
  const [showBars, setShowBars] = useState(false)
  const [showLabels, setShowLabels] = useState(false)
  const [showCards, setShowCards] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          timeoutIds.current.push(setTimeout(() => setShowBars(true), 300))
          timeoutIds.current.push(setTimeout(() => setShowLabels(true), 800))
          timeoutIds.current.push(setTimeout(() => setShowCards(true), 1500))
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      timeoutIds.current.forEach(clearTimeout)
    }
  }, [])

  // Max value across all bars for scale
  const allValues = groups.flatMap((g) => g.bars.map((b) => b.value))
  const maxValue = Math.max(...allValues, 1)
  const chartHeight = 180 // px for tallest bar

  // Auto-derive improvement cards if not provided
  const cards =
    improvements ??
    groups.flatMap((group) => {
      const baseline = group.bars[0]
      return group.bars.slice(1).map((bar) => {
        const pct = (((baseline.value - bar.value) / baseline.value) * 100).toFixed(1)
        return {
          title: `${bar.label} – ${group.name}`,
          details: `${bar.label} (${formatAsTime ? formatTime(bar.value) : `${bar.value} ${unit}`}) vs ${baseline.label} (${formatAsTime ? formatTime(baseline.value) : `${baseline.value} ${unit}`})`,
          percentage: `${pct}%`,
          highlight: bar.label.toLowerCase().includes('async'),
        }
      })
    })

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
      <EnvCard environment={environment} codeBlocks={codeBlocks} />

      {/* Chart */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>
        Performance Comparison ({unit} – lower is better)
      </h3>
      <div
        style={{
          backgroundColor: 'var(--color-background-300)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
          overflowX: 'auto',
          border: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
            padding: '20px 0',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          {groups.map((group, gi) => (
            <div
              key={group.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '240px',
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                {group.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  gap: '32px',
                  height: `${chartHeight + 70}px`,
                  width: '100%',
                }}
              >
                {group.bars.map((bar, bi) => (
                  <AnimatedBar
                    key={bar.label}
                    bar={bar}
                    maxValue={maxValue}
                    chartHeight={chartHeight}
                    active={showBars}
                    showLabels={showLabels}
                    unit={unit}
                    formatAsTime={formatAsTime}
                    delayMs={gi * 100 + bi * 150}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement cards */}
      {cards.length > 0 && (
        <>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>
            Performance Improvement
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            {cards.map((card, i) => (
              <div
                key={card.title}
                style={{
                  backgroundColor: card.highlight ? 'rgba(120,194,135,0.08)' : 'var(--color-background-300)',
                  border: `${card.highlight ? '2px' : '1px'} solid var(--color-accent)`,
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  opacity: showCards ? 1 : 0,
                  transform: showCards ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.6s ease ${i * 200}ms, transform 0.6s ease ${i * 200}ms`,
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    marginBottom: '8px',
                  }}
                >
                  {card.percentage}
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: '10px',
                  }}
                >
                  {card.title}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{card.details}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
