# Performance Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce initial load time and runtime CPU usage by optimizing images, lazy-loading below-fold JS, moving API fetches to the server, and scoping expensive event listeners.

**Architecture:** Six independent changes targeting the largest wins: (1) shrink the 156KB logo SVG, (2) defer below-fold image loads, (3) gate canvas animations behind IntersectionObserver, (4) move Contributors/OCBackers GitHub/OC API calls to ISR server components, (5) code-split the heavy BenchmarkGraph bundle with next/dynamic, (6) scope the GlowingEffect pointermove listener to its own element.

**Tech Stack:** Next.js 16 App Router, React 19, `npx svgo` (CLI), IntersectionObserver API, `next/dynamic`, React Suspense, ISR via `fetch` `next: { revalidate }`.

---

## Task 1: Optimize logo.svg with SVGO

**Files:**
- Modify: `public/logo.svg` (156 KB → target <30 KB)

**Step 1: Dry-run SVGO to preview savings**

```bash
npx svgo public/logo.svg --output /tmp/logo-optimized.svg
wc -c public/logo.svg /tmp/logo-optimized.svg
```

Expected: significant reduction (the SVG has Russian-named layers and an embedded PNG — SVGO will strip metadata, comments, and precision).

> **Note:** If the SVG embeds a `data:image/png;base64` blob and SVGO output is still >100 KB, the PNG itself is the culprit. In that case: extract the PNG to `public/logo.png`, use it in `Navbar.tsx`/`Footer.tsx`/`CommunityCTA.tsx` instead, and skip the SVG route for now. Then come back and note this for the user.

**Step 2: Apply SVGO in-place**

```bash
npx svgo public/logo.svg
```

**Step 3: Verify build still works**

```bash
npm run build
```

Expected: build succeeds, same page count as before.

**Step 4: Commit**

```bash
git add public/logo.svg
git commit -m "perf: optimize logo.svg with SVGO"
```

---

## Task 2: Lazy-load below-fold images

All contributor/backer/sponsor images are well below the fold. Next.js `<Image>` defaults to `lazy` for non-priority images — but explicit `loading="lazy"` also prevents the browser from resource-hinting them early. The real win here is removing any accidental `priority` or ensuring no eager hints.

**Files:**
- Modify: `components/marketing/Contributors.tsx:126-136`
- Modify: `components/marketing/OCBackers.tsx:194-214`
- Modify: `components/marketing/Sponsors.tsx:20-24` (gold/silver sponsor logos)

**Step 1: Add `loading="lazy"` to Contributors avatars**

In `components/marketing/Contributors.tsx`, find the `<Image>` tag (around line 126) and add the prop:

```tsx
<Image
  src={c.avatar_url}
  alt={c.login}
  width={AVATAR_SIZE}
  height={AVATAR_SIZE}
  loading="lazy"     // ← add this
  style={{ ... }}
/>
```

**Step 2: Add `loading="lazy"` to OCBackers avatars**

In `components/marketing/OCBackers.tsx`, find the `<Image>` tag (around line 194) and add:

```tsx
<Image
  src={b.image!}
  alt={b.name}
  width={AVATAR_SIZE}
  height={AVATAR_SIZE}
  loading="lazy"     // ← add this
  onError={...}
  style={{ ... }}
/>
```

**Step 3: Add `loading="lazy"` to Sponsor logos**

In `components/marketing/Sponsors.tsx`, both gold and silver sponsor `<Image>` tags:

```tsx
<Image src={s.logo} alt={s.name} width={120} height={40}
  loading="lazy"     // ← add
  style={{ objectFit: 'contain' }} />
```

**Step 4: Build and verify**

```bash
npm run build
```

**Step 5: Commit**

```bash
git add components/marketing/Contributors.tsx components/marketing/OCBackers.tsx components/marketing/Sponsors.tsx
git commit -m "perf: lazy-load below-fold avatar and sponsor images"
```

---

## Task 3: IntersectionObserver for FlickeringGrid (CommunityCTA section)

`FlickeringGrid` starts a continuous `requestAnimationFrame` loop immediately on mount, even when its section is off-screen. Gate it with `IntersectionObserver`.

**Files:**
- Modify: `components/ui/flickering-grid.tsx:35-95`

**Step 1: Add IntersectionObserver to the existing useEffect**

Replace the current `useEffect` body in `flickering-grid.tsx`. The canvas ref is already available. Add an `IntersectionObserver` that starts/stops the RAF loop when the canvas enters/leaves the viewport:

```tsx
useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const step = squareSize + gridGap
  let cols: number
  let rows: number
  let opacities: Float32Array

  function resize() {
    const parent = canvas!.parentElement
    if (!parent) return
    canvas!.width = parent.offsetWidth
    canvas!.height = parent.offsetHeight
    cols = Math.ceil(canvas!.width / step)
    rows = Math.ceil(canvas!.height / step)
    opacities = new Float32Array(cols * rows).fill(0)
  }

  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas.parentElement!)

  function draw() {
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < opacities.length; i++) {
      if (Math.random() < flickerChance * 0.1) {
        opacities[i] = Math.random() * maxOpacity
      }
      if (opacities[i] < 0.01) continue
      const col = i % cols
      const row = Math.floor(i / cols)
      ctx.fillStyle = toRgba(opacities[i])
      ctx.beginPath()
      ctx.roundRect(col * step, row * step, squareSize, squareSize, 1)
      ctx.fill()
    }
    frameRef.current = requestAnimationFrame(draw)
  }

  // Only animate when visible
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!frameRef.current) frameRef.current = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = 0
      }
    },
    { threshold: 0 }
  )
  io.observe(canvas)

  return () => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
    ro.disconnect()
    io.disconnect()
  }
}, [squareSize, gridGap, flickerChance, maxOpacity, toRgba])
```

**Step 2: Build and verify**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add components/ui/flickering-grid.tsx
git commit -m "perf: gate FlickeringGrid RAF behind IntersectionObserver"
```

---

## Task 4: Pause AnimatedGradientBackground when off-screen

The hero gradient runs a breathing RAF loop 60fps continuously. The hero is above fold on load, but after scrolling down it keeps running. Add an IntersectionObserver to pause the loop when the hero scrolls out of view.

**Files:**
- Modify: `components/ui/animated-gradient-background.tsx:54-103`

**Step 1: Wrap the RAF loop with IntersectionObserver**

Replace the existing `useEffect` in `animated-gradient-background.tsx`:

```tsx
useEffect(() => {
  let animationFrame: number
  let isVisible = true

  const animate = () => {
    if (!isVisible) return
    let width = widthRef.current
    let widthDir = widthDirRef.current
    let heightVar = heightVarRef.current
    let heightVel = heightVelRef.current
    let opacity = opacityRef.current

    if (width >= startingGap + breathingRange) widthDir = -1
    if (width <= startingGap - breathingRange) widthDir = 1
    if (!breathing) widthDir = 0
    width += widthDir * animationSpeed

    const targetOpacity = widthDir >= 0 ? 0.75 : 1.0
    opacity += (targetOpacity - opacity) * 0.008

    heightVel += (Math.random() - 0.5) * 0.12
    heightVel *= 0.94
    heightVar += heightVel
    if (heightVar > 12) { heightVar = 12; heightVel *= -0.5 }
    if (heightVar < -12) { heightVar = -12; heightVel *= -0.5 }

    widthRef.current = width
    widthDirRef.current = widthDir
    heightVarRef.current = heightVar
    heightVelRef.current = heightVel
    opacityRef.current = opacity

    const height = width + topOffset + heightVar
    const stops = gradientStops
      .map((stop, i) => `${gradientColors[i]} ${stop}%`)
      .join(', ')

    if (containerRef.current) {
      containerRef.current.style.background =
        `radial-gradient(${width}% ${height}% at 50% 20%, ${stops})`
      containerRef.current.style.opacity = String(opacity)
    }

    animationFrame = requestAnimationFrame(animate)
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        cancelAnimationFrame(animationFrame)
        animationFrame = requestAnimationFrame(animate)
      }
    },
    { threshold: 0 }
  )

  if (containerRef.current) io.observe(containerRef.current)
  animationFrame = requestAnimationFrame(animate)

  return () => {
    cancelAnimationFrame(animationFrame)
    io.disconnect()
  }
}, [startingGap, breathing, gradientColors, gradientStops, animationSpeed, breathingRange, topOffset])
```

**Step 2: Build and verify**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add components/ui/animated-gradient-background.tsx
git commit -m "perf: pause hero gradient animation when scrolled off-screen"
```

---

## Task 5: Server-side data fetching for Contributors + OCBackers

Currently Contributors and OCBackers fire `fetch()` calls from the browser on mount, causing a loading flash. Move the fetches to server components with 1h ISR revalidation, and wrap with React Suspense for streaming.

**Files:**
- Create: `components/marketing/ContributorsServer.tsx`
- Modify: `components/marketing/Contributors.tsx` (add `initialData` prop)
- Create: `components/marketing/OCBackersServer.tsx`
- Modify: `components/marketing/OCBackers.tsx` (add `initialData` prop)
- Modify: `app/[locale]/(site)/page.tsx` (use server wrappers + Suspense)

### 5a: Update Contributors to accept optional initialData

In `components/marketing/Contributors.tsx`, add an `initialData` prop. When provided, skip the useEffect fetch:

```tsx
interface Contributor {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

// Keep existing fetchContributors function for client fallback

export function Contributors({
  content,
  initialData,
}: {
  content: HomeConfig['contributors']
  initialData?: Contributor[]
}) {
  const [contributors, setContributors] = useState<Contributor[]>(initialData ?? [])
  const [loading, setLoading] = useState(!initialData)
  // ... rest of state

  useEffect(() => {
    if (initialData) return  // ← skip fetch if data was provided
    Promise.all([
      fetchContributors('Winds-Studio/Leaf'),
      fetchContributors('Winds-Studio/Leaf-website'),
    ]).then(([a, b]) => {
      // ... existing dedup logic
      setContributors(deduped)
      setLoading(false)
    })
  }, [initialData])
  // ... rest of component unchanged
}
```

### 5b: Create ContributorsServer server component

Create `components/marketing/ContributorsServer.tsx`:

```tsx
import { Contributors } from './Contributors'
import type { HomeConfig } from '@/content/home'

interface Contributor {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

async function fetchContributorsSSR(repo: string): Promise<Contributor[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contributors?per_page=50`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function ContributorsServer({
  content,
}: {
  content: HomeConfig['contributors']
}) {
  const [a, b] = await Promise.all([
    fetchContributorsSSR('Winds-Studio/Leaf'),
    fetchContributorsSSR('Winds-Studio/Leaf-website'),
  ])
  const merged = [...a, ...b]
  const seen = new Set<string>()
  const data = merged.filter((c) => {
    if (seen.has(c.login)) return false
    seen.add(c.login)
    return true
  })
  return <Contributors content={content} initialData={data} />
}
```

### 5c: Update OCBackers to accept optional initialData

In `components/marketing/OCBackers.tsx`, add an `initialData` prop:

```tsx
interface OCMember { name: string; image: string | null; profile: string; role: string; isActive: boolean }

export function OCBackers({ initialData }: { initialData?: OCMember[] }) {
  const [backers, setBackers] = useState<OCMember[]>(initialData ?? [])
  const [loading, setLoading] = useState(!initialData)

  useEffect(() => {
    if (initialData) return  // ← skip fetch if data was provided
    fetchOCBackers().then((data) => {
      setBackers(data)
      setLoading(false)
    })
  }, [initialData])
  // ... rest unchanged
}
```

### 5d: Create OCBackersServer server component

Create `components/marketing/OCBackersServer.tsx`:

```tsx
import { OCBackers } from './OCBackers'

interface OCMember { name: string; image: string | null; profile: string; role: string; isActive: boolean }

async function fetchOCBackersSSR(): Promise<OCMember[]> {
  try {
    const res = await fetch('https://opencollective.com/Winds-Studio/members/all.json', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data: OCMember[] = await res.json()
    return data.filter((m) => m.role === 'BACKER' && m.isActive)
  } catch {
    return []
  }
}

export async function OCBackersServer() {
  const data = await fetchOCBackersSSR()
  return <OCBackers initialData={data} />
}
```

### 5e: Update Sponsors.tsx to use OCBackersServer

In `components/marketing/Sponsors.tsx`, replace `<OCBackers />` with `<OCBackersServer />`:

```tsx
import { OCBackersServer } from './OCBackersServer'
// remove: import { OCBackers } from './OCBackers'

// In JSX, replace:
// <OCBackers />
// with:
// <OCBackersServer />
```

`Sponsors` is already a server component so this works.

### 5f: Update home page to use ContributorsServer + Suspense

In `app/[locale]/(site)/page.tsx`:

```tsx
import { Suspense } from 'react'
import { ContributorsServer } from '@/components/marketing/ContributorsServer'
// Remove: import { Contributors } from '@/components/marketing/Contributors'

// Replace:
// <Contributors content={home.contributors} />
// with:
<Suspense fallback={null}>
  <ContributorsServer content={home.contributors} />
</Suspense>
```

**Step 2: Build and verify — no loading flash**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add components/marketing/Contributors.tsx \
        components/marketing/ContributorsServer.tsx \
        components/marketing/OCBackers.tsx \
        components/marketing/OCBackersServer.tsx \
        components/marketing/Sponsors.tsx \
        app/[locale]/\(site\)/page.tsx
git commit -m "perf: move Contributors/OCBackers data fetching to server with ISR"
```

---

## Task 6: Code-split BenchmarkTabs with next/dynamic

`BenchmarkTabs` imports `BenchmarkGraph` which contains heavy animation code. Since it's rendered inside `Comparison` (a server component), the entire `BenchmarkGraph` module is included in the initial JS bundle. Use `next/dynamic` to load it only when needed.

**Files:**
- Modify: `components/marketing/Comparison.tsx:2`

**Step 1: Replace static import with dynamic import**

In `components/marketing/Comparison.tsx`, replace:

```tsx
// Before:
import { BenchmarkTabs } from './BenchmarkTabs'
```

with:

```tsx
// After:
import dynamic from 'next/dynamic'
const BenchmarkTabs = dynamic(() => import('./BenchmarkTabs').then(m => ({ default: m.BenchmarkTabs })), {
  ssr: false,
  loading: () => (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-default)',
      borderRadius: '12px',
      height: '200px',
    }} />
  ),
})
```

**Step 2: Build and verify**

```bash
npm run build
```

Look for BenchmarkTabs appearing as a separate chunk in build output.

**Step 3: Commit**

```bash
git add components/marketing/Comparison.tsx
git commit -m "perf: code-split BenchmarkTabs with next/dynamic"
```

---

## Task 7: Scope GlowingEffect pointermove to element instead of document.body

`GlowingEffect` currently attaches a global `pointermove` listener to `document.body`, which fires on every mouse movement anywhere on the page. Change it to attach to the element's own parent (the feature card), firing only when the mouse is within the card's extended proximity zone.

**Files:**
- Modify: `components/ui/glowing-effect.tsx:101-119`

**Step 1: Replace document.body listener with element-scoped listener**

In `glowing-effect.tsx`, replace the useEffect:

```tsx
useEffect(() => {
  if (disabled) return

  const element = containerRef.current
  if (!element) return

  // Attach to the nearest positioned parent (the feature card wrapper)
  const target = element.parentElement ?? document.body

  const handleScroll = () => handleMove()
  const handlePointerMove = (e: PointerEvent) => handleMove(e)

  window.addEventListener('scroll', handleScroll, { passive: true })
  target.addEventListener('pointermove', handlePointerMove, { passive: true })

  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    window.removeEventListener('scroll', handleScroll)
    target.removeEventListener('pointermove', handlePointerMove)
  }
}, [handleMove, disabled])
```

> **Note:** `target = element.parentElement` is the `<div style={{ position: 'relative', height: '100%', borderRadius: '...', border: '...' }}>` wrapper in `Features.tsx`. The `pointermove` event bubbles from children up to this wrapper, so the listener only fires when the mouse is over/around that specific card, not the whole page.

**Step 2: Build and verify**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add components/ui/glowing-effect.tsx
git commit -m "perf: scope GlowingEffect pointermove listener to card element"
```

---

## Final Verification

After all tasks:

```bash
npm run build
```

Check build output for:
- Smaller JS chunk for the main page (BenchmarkGraph split off)
- No TypeScript errors
- All 119 pages still generating successfully
