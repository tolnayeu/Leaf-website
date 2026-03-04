import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { source } from '@/lib/source'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { ArrowLeft, Home } from 'lucide-react'
import 'fumadocs-ui/style.css'

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const tree = source.getPageTree(locale)

  const title = (
    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Image
        src="/logo.svg"
        alt="Leaf"
        width={22}
        height={22}
        style={{ filter: 'drop-shadow(0 0 6px rgba(120,194,135,0.6))' }}
      />
      Leaf Docs
    </span>
  )

  return (
    <RootProvider>
      {/* Override fumadocs accent colour to leaf-green */}
      <style>{`
        /* Override primary colour in left nav sidebar only (not the TOC) */
        #nd-sidebar {
          --color-fd-primary: rgb(120, 194, 135);
        }
        #nd-sidebar [data-active="true"] {
          color: rgb(120, 194, 135) !important;
          background-color: rgba(120, 194, 135, 0.08) !important;
        }
        #nd-sidebar [data-active="true"]:hover {
          background-color: rgba(120, 194, 135, 0.12) !important;
        }
        #nd-sidebar [data-active="true"]::before {
          background-color: rgb(120, 194, 135) !important;
        }
        /* Put home link in the same row as the theme toggle */
        #nd-sidebar div:has(> .sidebar-home-link) {
          flex-direction: row;
          align-items: center;
        }
        /* Push theme toggle to the right */
        #nd-sidebar div:has(> .sidebar-home-link) > div {
          margin-left: auto;
        }
        .sidebar-home-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: var(--color-fd-muted-foreground);
          text-decoration: none;
          order: -1;
          transition: color 150ms ease;
        }
        .sidebar-home-link:hover {
          color: var(--color-fd-foreground);
        }
      `}</style>
      <DocsLayout
        tree={tree}
        nav={{ title }}
        sidebar={{
          footer: (
            <Link href={`/${locale}`} className="sidebar-home-link">
              <ArrowLeft size={13} strokeWidth={2} />
              <Home size={13} strokeWidth={2} />
              Home
            </Link>
          ),
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  )
}
