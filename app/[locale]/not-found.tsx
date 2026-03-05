'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(120,194,135,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Large faded "404" behind content */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          fontSize: 'clamp(160px, 30vw, 320px)',
          fontWeight: 800,
          color: 'rgba(255,255,255,0.025)',
          letterSpacing: '-0.04em',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        404
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '480px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <Image
            src="/logo.svg"
            alt="Leaf"
            width={56}
            height={56}
            style={{
              filter: 'drop-shadow(0 0 16px rgba(120,194,135,0.6)) drop-shadow(0 0 32px rgba(120,194,135,0.25))',
            }}
          />
        </div>

        {/* 404 label */}
        <div
          style={{
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--color-accent)',
            background: 'rgba(120,194,135,0.08)',
            border: '1px solid rgba(120,194,135,0.2)',
            borderRadius: '100px',
            padding: '3px 12px',
            marginBottom: '20px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: 'clamp(28px, 6vw, 40px)',
            fontWeight: 700,
            color: 'var(--color-fg-100)',
            letterSpacing: '-0.03em',
            margin: '0 0 12px',
          }}
        >
          Page not found
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: 'var(--color-fg-200)',
            lineHeight: 1.6,
            margin: '0 0 36px',
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.back()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              background: 'transparent',
              color: 'var(--color-fg-100)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <ArrowLeft size={15} strokeWidth={2} />
            Go back
          </button>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              background: 'linear-gradient(135deg, #78c287 0%, #5a922c 100%)',
              borderRadius: '6px',
              color: '#000',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 0 16px rgba(120,194,135,0.25)',
            }}
          >
            <Home size={15} strokeWidth={2} />
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}
