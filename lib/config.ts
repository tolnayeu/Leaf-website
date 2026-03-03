import { readFileSync, existsSync } from 'fs'
import path from 'path'

const CONFIG_DIR = path.join(process.cwd(), 'config')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge(base: any, overlay: any): any {
  if (Array.isArray(overlay)) return overlay
  if (typeof overlay !== 'object' || overlay === null) return overlay
  if (typeof base !== 'object' || base === null) return overlay
  const result = { ...base }
  for (const key of Object.keys(overlay)) {
    result[key] = key in base ? deepMerge(base[key], overlay[key]) : overlay[key]
  }
  return result
}

/**
 * Reads `config/<name>.json` and deep-merges `config/<name>.<locale>.json`
 * on top of it (if the locale file exists).
 *
 * Adding a new locale is as simple as dropping a `config/<name>.<locale>.json`
 * file — no code changes required.
 */
export function getConfig<T = unknown>(name: string, locale = 'en'): T {
  const basePath = path.join(CONFIG_DIR, `${name}.json`)
  const base = JSON.parse(readFileSync(basePath, 'utf8'))

  if (locale !== 'en') {
    const localePath = path.join(CONFIG_DIR, `${name}.${locale}.json`)
    if (existsSync(localePath)) {
      const overlay = JSON.parse(readFileSync(localePath, 'utf8'))
      return deepMerge(base, overlay) as T
    }
  }

  return base as T
}

// ── Typed helpers ─────────────────────────────────────────────────────────────

import type homeBase from '@/config/home.json'
import type navBase  from '@/config/nav.json'

interface Sponsor {
  name: string
  href: string
  logo: string
}

interface CommunitySponsor {
  name: string
  href: string
}

type HomeConfigBase = typeof homeBase

export type HomeConfig = Omit<HomeConfigBase, 'sponsors'> & {
  sponsors: Omit<HomeConfigBase['sponsors'], 'gold' | 'silver' | 'community'> & {
    gold: Sponsor[]
    silver: Sponsor[]
    community: CommunitySponsor[]
  }
}
export type NavConfig  = typeof navBase

export const getHomeConfig = (locale: string) => getConfig<HomeConfig>('home', locale)
export const getNavConfig  = ()                => getConfig<NavConfig>('nav')
