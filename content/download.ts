import downloadConfig from '@/config/download.json'

export type VersionStatus = 'stable' | 'experimental' | 'discontinued' | 'dead'

export const downloadContent = {
  title: 'Download Leaf',
  subtitle: 'Choose your Minecraft version and grab the latest build.',

  defaultVersion: downloadConfig.defaultVersion,

  versionStatus: {
    stable:       { label: 'Stable',       description: 'Actively maintained. Recommended for production.' },
    experimental: { label: 'Experimental', description: 'Experimental features. Not recommended for production.' },
    discontinued: { label: 'Discontinued', description: 'No longer maintained. Use at your own risk.' },
    dead:         { label: 'Dead',         description: 'No longer supported.' },
  } satisfies Record<VersionStatus, { label: string; description: string }>,

  versionStatusMap: downloadConfig.versions as Record<string, VersionStatus>,

  ui: {
    loading: 'Loading builds…',
    latestBuild: 'Latest Build',
    buildHistory: 'Build History',
    showMore: (count: number) => `↓ Show ${count} more`,
    showLess: '↑ Show less',
  },

  legacyLink: {
    label: 'Looking for older versions?',
    href: 'https://github.com/Winds-Studio/Leaf/releases',
  },
}
