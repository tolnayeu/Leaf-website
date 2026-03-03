import { source } from '@/lib/source'
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { ConfigViewer } from '@/components/docs/ConfigViewer'
import { BenchmarkGraph } from '@/components/docs/BenchmarkGraph'
import { VersionBadge } from '@/components/docs/VersionBadge'
import { setRequestLocale } from 'next-intl/server'

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[]; locale: string }>
}) {
  const { slug, locale } = await params
  setRequestLocale(locale)
  const page = source.getPage(slug ?? [], locale)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{
          ...defaultMdxComponents,
          ConfigViewer,
          BenchmarkGraph,
          VersionBadge,
        }} />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  // With i18n (parser: 'dir'), page slugs have no locale prefix.
  // Return unique slugs only; the parent [locale] segment handles locale combinations.
  const seen = new Set<string>()
  return source.getLanguages().flatMap(({ pages }) =>
    pages
      .filter(page => {
        const key = page.slugs.join('/')
        return seen.has(key) ? false : (seen.add(key), true)
      })
      .map(page => ({ slug: page.slugs }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[]; locale: string }>
}) {
  const { slug, locale } = await params
  const page = source.getPage(slug ?? [], locale)
  if (!page) notFound()
  return { title: page.data.title, description: page.data.description }
}
