import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { source } from '@/lib/source'
import Image from 'next/image'
import type { ReactNode } from 'react'
import type { PageTree } from 'fumadocs-core/server'
import 'fumadocs-ui/style.css'

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const fullTree = source.pageTree
  const localeFolder = fullTree.children.find(
    (node): node is PageTree.Folder =>
      node.type === 'folder' &&
      (node.index?.url === `/docs/${locale}` ||
        node.index?.url?.startsWith(`/docs/${locale}/`))
  )
  const tree: PageTree.Root = localeFolder
    ? { ...fullTree, children: localeFolder.children }
    : fullTree

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
      `}</style>
      <DocsLayout
        tree={tree}
        nav={{ title }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  )
}
