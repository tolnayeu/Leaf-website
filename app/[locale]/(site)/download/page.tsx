import { Suspense } from 'react'
import { DownloadPage } from '@/components/download/DownloadPage'
import { Footer } from '@/components/ui/Footer'

export default function Page() {
  return (
    <>
      <Suspense>
        <DownloadPage />
      </Suspense>
      <Footer />
    </>
  )
}
