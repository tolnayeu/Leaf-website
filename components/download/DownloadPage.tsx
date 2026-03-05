'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getVersions, getBuilds, type Build } from '@/lib/leafApi'
import { VersionDropdown } from './VersionDropdown'
import { BuildCard } from './BuildCard'
import { Spinner } from '@/components/ui/Spinner'
import { downloadContent, type VersionStatus } from '@/content/download'
import { AlertTriangle, FlaskConical } from 'lucide-react'

export function DownloadPage() {
  const searchParams = useSearchParams()
  const [versions, setVersions] = useState<string[]>([])
  const [selected, setSelected] = useState('')
  const [builds, setBuilds] = useState<Build[]>([])
  const [loading, setLoading] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    getVersions().then((v) => {
      // Sort newest first using semver comparison
      const sorted = [...v].sort((a, b) => {
        const pa = a.split('.').map(Number)
        const pb = b.split('.').map(Number)
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
          const diff = (pb[i] ?? 0) - (pa[i] ?? 0)
          if (diff !== 0) return diff
        }
        return 0
      })
      setVersions(sorted)
      const requested = searchParams.get('v')
      if (requested && sorted.includes(requested)) {
        setSelected(requested)
      } else {
        const def = downloadContent.defaultVersion
        setSelected(sorted.includes(def) ? def : (sorted[0] ?? ''))
      }
    })
  }, [])

  useEffect(() => {
    if (!selected) return
    setLoading(true)
    setShowAll(false)
    getBuilds(selected).then((b) => {
      setBuilds([...b].reverse())
      setLoading(false)
    })
  }, [selected])

  const visibleBuilds = showAll ? builds : builds.slice(0, 6)

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
      <h1 style={{ fontSize: '40px', fontWeight: 700, color: 'var(--color-fg-100)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
        {downloadContent.title}
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--color-fg-200)', marginBottom: '40px' }}>
        {downloadContent.subtitle}
      </p>

      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
        <VersionDropdown versions={versions} selected={selected} onChange={setSelected} />
      </div>

      {/* Version status banners */}
      {(() => {
        const status = (downloadContent.versionStatusMap[selected] ?? 'stable') as VersionStatus
        const info = downloadContent.versionStatus[status]
        if (status === 'discontinued') return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            marginBottom: '24px',
            borderRadius: '8px',
            border: '1px solid rgba(229,72,77,0.3)',
            background: 'rgba(229,72,77,0.07)',
            fontSize: '13px',
            color: 'var(--color-error)',
          }}>
            <AlertTriangle size={16} strokeWidth={1.75} style={{ flexShrink: 0 }} />
            <span>
              <strong>Discontinued</strong> — {info.description}
            </span>
          </div>
        )
        if (status === 'experimental') return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            marginBottom: '24px',
            borderRadius: '8px',
            border: '1px solid rgba(59,158,221,0.3)',
            background: 'rgba(59,158,221,0.07)',
            fontSize: '13px',
            color: 'var(--color-info)',
          }}>
            <FlaskConical size={16} strokeWidth={1.75} style={{ flexShrink: 0 }} />
            <span>
              <strong>Experimental</strong> — {info.description}
            </span>
          </div>
        )
        return null
      })()}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <Spinner size={32} />
        </div>
      ) : (
        <>
          {builds[0] && (
            <div style={{ marginBottom: '32px' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-fg-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                {downloadContent.ui.latestBuild}
              </p>
              <BuildCard build={builds[0]} version={selected} highlight />
            </div>
          )}

          {builds.length > 1 && (
            <div>
              <p style={{ fontSize: '12px', color: 'var(--color-fg-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                {downloadContent.ui.buildHistory}
              </p>
              {visibleBuilds.slice(1).map((b) => (
                <BuildCard key={b.build} build={b} version={selected} />
              ))}
              {builds.length > 6 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  style={{
                    marginTop: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-fg-200)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {showAll ? downloadContent.ui.showLess : downloadContent.ui.showMore(builds.length - 6)}
                </button>
              )}
            </div>
          )}

          <p style={{ marginTop: '40px', fontSize: '13px', color: 'var(--color-fg-300)' }}>
            <a href={downloadContent.legacyLink.href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
              {downloadContent.legacyLink.label}
            </a>
          </p>
        </>
      )}
    </main>
  )
}
