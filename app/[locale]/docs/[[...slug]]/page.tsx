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
  // docs files live at docs/{locale}/... so prepend locale to slug
  const page = source.getPage([locale, ...(slug ?? [])])
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
  return source.generateParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[]; locale: string }>
}) {
  const { slug, locale } = await params
  const page = source.getPage([locale, ...(slug ?? [])])
  if (!page) notFound()
  return { title: page.data.title, description: page.data.description }
}
