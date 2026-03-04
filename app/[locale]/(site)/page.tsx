import { Hero } from '@/components/marketing/Hero'
import { BenchmarkSection } from '@/components/marketing/BenchmarkSection'
import { Features } from '@/components/marketing/Features'
import { Comparison } from '@/components/marketing/Comparison'
import { Sponsors } from '@/components/marketing/Sponsors'
import { CommunityCTA } from '@/components/marketing/CommunityCTA'
import { Contributors } from '@/components/marketing/Contributors'
import { Footer } from '@/components/ui/Footer'
import { getHomeConfig } from '@/lib/config'
import { setRequestLocale } from 'next-intl/server'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const home = getHomeConfig(locale)

  return (
    <main>
      <Hero content={home.hero} />
      <BenchmarkSection />
      <Features content={home.features} />
      <Comparison content={home.comparison} />
      <Sponsors content={home.sponsors} />
      <CommunityCTA content={home.community} />
      <Contributors content={home.contributors} />
      <Footer />
    </main>
  )
}
