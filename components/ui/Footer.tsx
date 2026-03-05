import Link from 'next/link'
import Image from 'next/image'
import { getNavConfig } from '@/lib/config'

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
    </svg>
  )
}

export function Footer() {
  const nav = getNavConfig()
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          borderLeft: '1px solid var(--color-border)',
        }}
      >
        {/* Col 1: Brand */}
        <div
          style={{
            borderRight: '1px solid var(--color-border)',
            padding: 'var(--space-5) var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
            <Image src="/logo.svg" alt="Leaf" width={18} height={18} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-fg-100)' }}>Leaf</span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-300)', lineHeight: 'var(--leading-base)', margin: '0 0 var(--space-3)', maxWidth: '260px' }}>
            A Paper fork focused on performance, vanilla behavior, and stability.
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-400)', margin: 0 }}>
            © {new Date().getFullYear()} Winds Studio · MIT License
          </p>
        </div>

        {/* Col 2: Links */}
        <div
          style={{
            borderRight: '1px solid var(--color-border)',
            padding: 'var(--space-5) var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-fg-300)', margin: 0 }}>
            Resources
          </p>
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-200)', textDecoration: 'none', transition: 'color var(--duration) var(--ease)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Col 3: Social */}
        <div
          style={{
            borderRight: '1px solid var(--color-border)',
            padding: 'var(--space-5) var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-fg-300)', margin: 0 }}>
            Community
          </p>
          <a
            href={nav.social.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-fg-200)', textDecoration: 'none', transition: 'color var(--duration) var(--ease)' }}
          >
            <GitHubIcon /> GitHub
          </a>
          <a
            href={nav.social.discord}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-fg-200)', textDecoration: 'none', transition: 'color var(--duration) var(--ease)' }}
          >
            <DiscordIcon /> Discord
          </a>
        </div>
      </div>
    </footer>
  )
}
