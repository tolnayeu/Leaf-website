'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

// ---------------------------------------------------------------------------
// Types (mirrors Leaf-website types.ts)
// ---------------------------------------------------------------------------

type ConfigValueType = string | number | boolean | (string | number | boolean)[]

interface RawConfigValue {
  default: ConfigValueType
  desc?: string
}

interface RawConfigSection {
  __desc__?: string
  [key: string]: RawConfigSection | RawConfigValue | string | undefined
}

type ConfigRoot = Record<string, RawConfigSection | RawConfigValue>

// ---------------------------------------------------------------------------
// Internal tree nodes (mirrors Leaf-website config.ts classes)
// ---------------------------------------------------------------------------

interface ConfigValueNode {
  kind: 'value'
  name: string
  default: ConfigValueType
  description?: string
}

interface ConfigSectionNode {
  kind: 'section'
  name: string
  description?: string
  nodes: ConfigNode[]
}

type ConfigNode = ConfigValueNode | ConfigSectionNode

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

function isRawValue(v: unknown): v is RawConfigValue {
  if (typeof v !== 'object' || v === null) return false
  return 'default' in v || ('desc' in v && !('__desc__' in v))
}

function parseNode(name: string, raw: RawConfigSection | RawConfigValue): ConfigNode {
  if (isRawValue(raw)) {
    return {
      kind: 'value',
      name,
      default: (raw as RawConfigValue).default,
      description: (raw as RawConfigValue).desc,
    }
  }
  // It's a section
  const section = raw as RawConfigSection
  const description = typeof section.__desc__ === 'string' ? section.__desc__ : undefined
  const nodes: ConfigNode[] = []
  for (const key of Object.keys(section)) {
    if (key === '__desc__') continue
    const child = section[key]
    if (child === undefined) continue
    nodes.push(parseNode(key, child as RawConfigSection | RawConfigValue))
  }
  return { kind: 'section', name, description, nodes }
}

function serializeConfig(json: ConfigRoot): ConfigNode[] {
  return Object.keys(json).map((key) => parseNode(key, json[key]))
}

// ---------------------------------------------------------------------------
// Helper: split a default value into inline + rest lines
// ---------------------------------------------------------------------------

function splitDefault(def: ConfigValueType): { inline: string; rest: string[] } {
  if (typeof def === 'string') {
    const lines = def.split('\n')
    return { inline: lines[0], rest: lines.slice(1) }
  }
  if (Array.isArray(def)) {
    const strs = def.map(String)
    return { inline: strs[0] ?? '', rest: strs.slice(1) }
  }
  return { inline: String(def), rest: [] }
}

function isNumeric(s: string): boolean {
  return !isNaN(parseFloat(s)) && s.trim() !== ''
}

// ---------------------------------------------------------------------------
// Lightweight HTML sanitizer for static config descriptions
// Strips script/style tags and event handler attributes.
// Content comes from trusted project config data, not user input.
// ---------------------------------------------------------------------------

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/\s+on\w+="[^"]*"/gi, '')
    .replace(/\s+on\w+='[^']*'/gi, '')
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '')
    .replace(/src\s*=\s*["']data:[^"']*["']/gi, '')
}

// ---------------------------------------------------------------------------
// Description renderer (HTML content from trusted config data)
// ---------------------------------------------------------------------------

function DescriptionBlock({ html }: { html: string }) {
  const safe = sanitizeHtml(html)
  // NOTE: Content is sourced exclusively from the project's own config data
  // files (leaf-global-latest.ts etc.), not from any user-supplied input.
  // The sanitizeHtml pass above strips script/style/on* handlers as an
  // additional precaution.
  return (
    <div
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safe }}
      style={{
        background: 'var(--color-background-300)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-fg-100)',
        padding: '0.5rem 0.75rem',
        margin: '0.25rem 0',
        borderLeft: '4px solid var(--color-accent)',
        borderRadius: '4px',
        lineHeight: '26px',
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface NodeProps {
  node: ConfigNode
  globalSignal: 'expand' | 'collapse' | null
  signalKey: number
}

function useGlobalSignal(
  signalKey: number,
  globalSignal: 'expand' | 'collapse' | null,
  localOpen: boolean,
  setLocalOpen: (v: boolean) => void
) {
  useEffect(() => {
    if (globalSignal !== null) {
      setLocalOpen(globalSignal === 'expand')
    }
  }, [signalKey, globalSignal, setLocalOpen])

  return localOpen
}

function ConfigValueNodeComp({ node, globalSignal, signalKey }: NodeProps & { node: ConfigValueNode }) {
  const [localOpen, setLocalOpen] = useState(false)
  const effectiveOpen = useGlobalSignal(signalKey, globalSignal, localOpen, setLocalOpen)

  const { inline, rest } = splitDefault(node.default)
  const numeric = isNumeric(inline)

  const handleToggle = () => {
    if (!node.description) return
    setLocalOpen(!effectiveOpen)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <button
        onClick={handleToggle}
        style={{
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: node.description ? 'pointer' : 'default',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          textAlign: 'left',
        }}
      >
        <span style={{ whiteSpace: 'nowrap', color: 'var(--color-accent)' }}>
          {node.name}
          <span style={{ color: 'var(--color-fg-300)' }}>:</span>
        </span>
        <span
          style={{
            whiteSpace: 'nowrap',
            color: numeric ? '#7aa2f7' : 'var(--color-success)',
          }}
        >
          {inline}
        </span>
        {node.description && (
          <span
            style={{
              fontSize: '12px',
              transition: 'transform 100ms ease-in-out',
              transform: effectiveOpen ? 'rotate(90deg)' : 'none',
              marginLeft: '0.25rem',
              color: 'var(--color-fg-300)',
              display: 'inline-block',
            }}
          >
            ▶
          </span>
        )}
      </button>
      {rest.length > 0 && (
        <div
          style={{
            marginLeft: '1rem',
            color: 'var(--color-success)',
            whiteSpace: 'pre',
          }}
        >
          {rest.join('\n')}
        </div>
      )}
      {effectiveOpen && node.description && (
        <DescriptionBlock html={node.description} />
      )}
    </div>
  )
}

function ConfigSectionNodeComp({ node, globalSignal, signalKey }: NodeProps & { node: ConfigSectionNode }) {
  const [localOpen, setLocalOpen] = useState(false)
  const effectiveOpen = useGlobalSignal(signalKey, globalSignal, localOpen, setLocalOpen)

  const handleToggle = () => {
    if (!node.description) return
    setLocalOpen(!effectiveOpen)
  }

  return (
    <div>
      {node.description ? (
        <button
          onClick={handleToggle}
          style={{
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'inherit',
          }}
        >
          <span style={{ whiteSpace: 'nowrap', color: 'var(--color-fg-200)' }}>
            {node.name}
            <span style={{ color: 'var(--color-fg-300)' }}>:</span>
          </span>
          <span
            style={{
              fontSize: '12px',
              transition: 'transform 100ms ease-in-out',
              transform: effectiveOpen ? 'rotate(90deg)' : 'none',
              marginLeft: '0.25rem',
              color: 'var(--color-fg-300)',
              display: 'inline-block',
            }}
          >
            ▶
          </span>
        </button>
      ) : (
        <span style={{ whiteSpace: 'nowrap', color: 'var(--color-fg-200)' }}>
          {node.name}
          <span style={{ color: 'var(--color-fg-300)' }}>:</span>
        </span>
      )}

      {effectiveOpen && node.description && (
        <DescriptionBlock html={node.description} />
      )}

      {node.nodes.map((child) => (
        <div key={child.name} style={{ marginLeft: '1rem' }}>
          <ConfigNodeComp node={child} globalSignal={globalSignal} signalKey={signalKey} />
        </div>
      ))}
    </div>
  )
}

function ConfigNodeComp({ node, globalSignal, signalKey }: NodeProps) {
  if (node.kind === 'value') {
    return <ConfigValueNodeComp node={node} globalSignal={globalSignal} signalKey={signalKey} />
  }
  return <ConfigSectionNodeComp node={node} globalSignal={globalSignal} signalKey={signalKey} />
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

interface ConfigViewerProps {
  /** Raw config JSON object (same structure as the Vue ConfigRoot type) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>
}

export function ConfigViewer({ config }: ConfigViewerProps) {
  const nodes = serializeConfig(config as ConfigRoot)
  const [globalSignal, setGlobalSignal] = useState<'expand' | 'collapse' | null>(null)
  const [signalKey, setSignalKey] = useState(0)

  const emit = useCallback((state: 'expand' | 'collapse') => {
    setGlobalSignal(state)
    setSignalKey((k) => k + 1)
  }, [])

  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        backgroundColor: 'var(--color-background-200)',
        padding: '1rem',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '50rem',
        overflowX: 'auto',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Expand / Collapse buttons */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => emit('expand')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.15rem 0.75rem',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-background-300)',
            borderRadius: '0.25rem',
            color: 'var(--color-fg-100)',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          {/* unfold-vertical icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3H5a2 2 0 0 0-2 2v4" /><path d="M9 21H5a2 2 0 0 1-2-2v-4" />
            <path d="M15 3h4a2 2 0 0 1 2 2v4" /><path d="M15 21h4a2 2 0 0 0 2-2v-4" />
            <line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span>Expand all</span>
        </button>
        <button
          onClick={() => emit('collapse')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.15rem 0.75rem',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-background-300)',
            borderRadius: '0.25rem',
            color: 'var(--color-fg-100)',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          {/* fold-vertical icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3H5a2 2 0 0 0-2 2v4" /><path d="M9 21H5a2 2 0 0 1-2-2v-4" />
            <path d="M15 3h4a2 2 0 0 1 2 2v4" /><path d="M15 21h4a2 2 0 0 0 2-2v-4" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span>Collapse all</span>
        </button>
      </div>

      {/* Config tree */}
      {nodes.map((node) => (
        <ConfigNodeComp key={node.name} node={node} globalSignal={globalSignal} signalKey={signalKey} />
      ))}
    </div>
  )
}
