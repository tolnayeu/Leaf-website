import { Navbar } from '@/components/ui/Navbar'
import { getNavConfig } from '@/lib/config'
import type { ReactNode } from 'react'

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const nav = getNavConfig()
  return (
    <>
      <Navbar config={nav} />
      {children}
    </>
  )
}
