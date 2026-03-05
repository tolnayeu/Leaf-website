'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { downloadContent, type VersionStatus } from '@/content/download'

const statusColors: Record<VersionStatus, string> = {
  stable:       'var(--color-success)',
  experimental: 'var(--color-info)',
  discontinued: 'var(--color-error)',
  dead:         'var(--color-fg-300)',
}

interface Props {
  versions: string[]
  selected: string
  onChange: (v: string) => void
}

export function VersionDropdown({ versions, selected, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const status = (downloadContent.versionStatusMap[selected] ?? 'stable') as VersionStatus

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', minWidth: '220px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          border: `1px solid ${open ? 'var(--color-border-hover)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius)',
          background: 'var(--color-background-200)',
          color: 'var(--color-fg-100)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          width: '100%',
          fontFamily: 'var(--font-mono)',
          transition: 'border-color var(--duration) var(--ease)',
        }}
        aria-expanded={open}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColors[status], flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: 'left' }}>{selected || 'Select version…'}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--duration) var(--ease)',
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            border: '1px solid var(--color-border)',
            background: 'var(--color-background-300)',
            overflow: 'hidden',
            zIndex: 50,
            padding: '4px',
          }}
        >
          {versions.map((v) => {
            const s = (downloadContent.versionStatusMap[v] ?? 'stable') as VersionStatus
            const info = downloadContent.versionStatus[s]
            const isSelected = v === selected
            const isHov = hovered === v
            return (
              <button
                key={v}
                onClick={() => { onChange(v); setOpen(false) }}
                onMouseEnter={() => setHovered(v)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected
                    ? 'var(--color-accent-subtle)'
                    : isHov
                    ? 'var(--color-background-200)'
                    : 'transparent',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-fg-100)',
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'left',
                  transition: 'background var(--duration-fast) var(--ease)',
                }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusColors[s], flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{v}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: statusColors[s], opacity: 0.9 }}>
                  {info.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
