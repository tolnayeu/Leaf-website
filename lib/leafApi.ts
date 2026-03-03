const BASE = 'https://api.leafmc.one/v2'

export interface Build {
  build: number
  time: string
  changes: { summary: string; commit: string }[]
  downloads: Record<string, { name: string; sha256: string }>
}

export async function getVersions(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE}/projects/leaf`)
    if (!res.ok) return []
    const data = await res.json()
    return data.versions ?? []
  } catch {
    return []
  }
}

export async function getBuilds(version: string): Promise<Build[]> {
  try {
    const res = await fetch(`${BASE}/projects/leaf/versions/${version}/builds`)
    if (!res.ok) return []
    const data = await res.json()
    return data.builds ?? []
  } catch {
    return []
  }
}

export function getDownloadUrl(version: string, build: number, filename: string): string {
  return `${BASE}/projects/leaf/versions/${version}/builds/${build}/downloads/${filename}`
}
