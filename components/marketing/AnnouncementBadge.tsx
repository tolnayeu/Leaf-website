'use client'
import Link from 'next/link'
import { FlaskConical, ChevronRight } from 'lucide-react'

interface Props { text: string; href?: string }

export function AnnouncementBadge({ text, href }: Props) {
  const badge = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '999px',
        border: '1px solid var(--color-accent-border)',
        padding: '4px 12px',
        fontSize: 'var(--text-xs)',
        fontWeight: 500,
        background: 'var(--color-accent-subtle)',
        color: 'var(--color-accent)',
        cursor: href ? 'pointer' : 'default',
      }}
    >
      <FlaskConical size={11} strokeWidth={1.5} />
      {text}
      {href && <ChevronRight size={11} strokeWidth={2} style={{ opacity: 0.6 }} />}
    </span>
  )
  if (href) return <Link href={href} style={{ textDecoration: 'none' }}>{badge}</Link>
  return badge
}
