import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { createMDX } from 'fumadocs-mdx/next'
import path from 'path'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
const withMDX = createMDX()

const config: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/docs/:locale/:path*',
        destination: '/:locale/docs/:path*',
        permanent: false,
      },
      {
        source: '/docs/:locale',
        destination: '/:locale/docs',
        permanent: false,
      },
    ]
  },
}

export default withNextIntl(withMDX(config))
