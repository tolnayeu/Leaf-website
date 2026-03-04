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
      { protocol: 'https', hostname: 'images.opencollective.com' },
      { protocol: 'https', hostname: 'opencollective-production.s3.us-west-1.amazonaws.com' },
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
      {
        source: '/:locale/docs',
        destination: '/:locale/docs/getting-started',
        permanent: false,
      },
    ]
  },
}

export default withNextIntl(withMDX(config))
