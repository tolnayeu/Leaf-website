import type { ReactNode } from 'react'

export function AvatarTooltip({ isSecond, children }: { isSecond: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        ...(isSecond ? { top: 'calc(100% + 8px)' } : { bottom: 'calc(100% + 6px)' }),
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: '6px',
        padding: '3px 8px',
        fontSize: '12px',
        color: 'var(--text-primary)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      }}
    >
      {children}
    </div>
  )
}
