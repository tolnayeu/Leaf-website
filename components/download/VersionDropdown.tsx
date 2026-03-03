'use client'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { downloadContent, type VersionStatus } from '@/content/download'

const statusColors: Record<VersionStatus, string> = {
  stable:       'var(--color-success)',
  experimental: 'var(--color-info)',
  discontinued: 'var(--color-error)',
  dead:         'var(--text-muted)',
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
  const statusInfo = downloadContent.versionStatus[status]

  return (
    <MotionConfig transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}>
      <div ref={ref} style={{ position: 'relative', display: 'inline-block', minWidth: '220px' }}>
        {/* Trigger */}
        <motion.button
          onClick={() => setOpen(!open)}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 16px',
            border: open ? '1px solid var(--border-hover)' : '1px solid var(--border-default)',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer',
            width: '100%',
            fontFamily: 'var(--font-mono)',
            transition: 'border-color 150ms ease',
          }}
          aria-expanded={open}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColors[status], flexShrink: 0 }} />
          <span style={{ flex: 1, textAlign: 'left' }}>{selected || 'Select version…'}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} strokeWidth={1.5} />
          </motion.div>
        </motion.button>

        {/* Dropdown panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -4 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                border: '1px solid var(--border-default)',
                borderRadius: '10px',
                background: 'var(--bg-elevated)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                zIndex: 50,
              }}
            >
              <div style={{ padding: '4px' }}>
                {versions.map((v, idx) => {
                  const s = (downloadContent.versionStatusMap[v] ?? 'stable') as VersionStatus
                  const info = downloadContent.versionStatus[s]
                  const isSelected = v === selected
                  const isHovered = hovered === v
                  return (
                    <motion.button
                      key={v}
                      onClick={() => { onChange(v); setOpen(false) }}
                      onHoverStart={() => setHovered(v)}
                      onHoverEnd={() => setHovered(null)}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '9px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        background: isSelected
                          ? 'rgba(120,194,135,0.08)'
                          : isHovered
                          ? 'var(--bg-card)'
                          : 'transparent',
                        color: isSelected ? 'var(--brand)' : 'var(--text-primary)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        textAlign: 'left',
                        transition: 'background 120ms ease, color 120ms ease',
                      }}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.03 } }}
                    >
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusColors[s], flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{v}</span>
                      <span style={{ fontSize: '11px', color: statusColors[s], opacity: 0.9 }}>
                        {info.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
