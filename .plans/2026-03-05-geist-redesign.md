# Geist Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the LeafMC website with a Geist-principled design system — 8px spacing grid, strict typographic scale, border-driven cards, brand green accent, no canvas/RAF effects, CSS-only motion.

**Architecture:** Replace `styles/tokens.css` with a new semantic token system, strip `globals.css` to essentials + two button classes, then rewrite each component in order. Old canvas/animation components are deleted. The hero gains a split layout with a static terminal window. All inline `rgba()` color values are replaced with token references.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, Geist Sans/Mono, inline styles + CSS custom properties, no motion/react on marketing pages.

**Design reference:** `.plans/2026-03-05-geist-redesign-design.md`

---

## Task 1: Replace design tokens

**Files:**
- Modify: `styles/tokens.css`

**Step 1: Replace the entire file**

```css
/* styles/tokens.css */
:root {
  /* Backgrounds */
  --color-background-100: #0a0a0a;
  --color-background-200: #111111;
  --color-background-300: #1a1a1a;

  /* Borders */
  --color-border:       #2e2e2e;
  --color-border-hover: #444444;

  /* Foreground */
  --color-fg-100: #ededed;
  --color-fg-200: #a1a1a1;
  --color-fg-300: #6f6f6f;
  --color-fg-400: #444444;

  /* Accent */
  --color-accent:        #78c287;
  --color-accent-subtle: rgba(120, 194, 135, 0.08);
  --color-accent-border: rgba(120, 194, 135, 0.2);

  /* Semantic */
  --color-success: #78c287;
  --color-error:   #e5484d;
  --color-warning: #f76b15;
  --color-info:    #3b9edd;

  /* Typography */
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;

  --text-xs:   11px;  --leading-xs:   16px;
  --text-sm:   13px;  --leading-sm:   20px;
  --text-base: 15px;  --leading-base: 24px;
  --text-lg:   18px;  --leading-lg:   28px;
  --text-xl:   24px;  --leading-xl:   32px;
  --text-2xl:  32px;  --leading-2xl:  40px;

  /* Spacing (8px base) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 48px;
  --space-6: 64px;
  --space-7: 80px;
  --space-8: 96px;
  --space-9: 128px;

  /* Radius */
  --radius-sm: 4px;
  --radius:    8px;
  --radius-lg: 12px;

  /* Motion */
  --duration-fast: 100ms;
  --duration:      150ms;
  --duration-base: 300ms;
  --ease:     ease;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Step 2: Build to confirm no hard errors yet (many token references will be broken — that's expected)**

```bash
npm run build 2>&1 | grep "error" | head -20
```

Expected: build may warn about missing CSS variables — that's fine at this stage.

**Step 3: Commit**

```bash
git add styles/tokens.css
git commit -m "feat(tokens): replace with Geist 8px-grid token system"
```

---

## Task 2: Rewrite globals.css

**Files:**
- Modify: `app/globals.css`

**Step 1: Replace the entire file**

Keep mobile responsive rules from the current file, strip all button classes except the two new ones, add `@keyframes fadeSlideUp`.

```css
@import '../styles/tokens.css';
@import 'tailwindcss';

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

/* ─── Mobile responsive ─── */
@media (max-width: 640px) {
  .nav-links,
  .nav-right { display: none !important; }
  .nav-hamburger { display: flex !important; }

  .stat-cards { flex-direction: column !important; }
  .stat-cards > * { flex: none !important; width: 100% !important; min-width: 0 !important; }
}

body {
  background: var(--color-background-100);
  color: var(--color-fg-100);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-base);
  -webkit-font-smoothing: antialiased;
}

code, pre, kbd {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

/* ─── Spinner ─── */
@keyframes spin-svg { to { transform: rotate(360deg); } }
.round-spinner {
  animation: spin-svg 0.9s linear infinite;
  transform-origin: center;
}

/* ─── Hero entrance animation ─── */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-animate {
  animation: fadeSlideUp var(--duration-base) var(--ease-out) both;
}
.hero-animate-delay-1 { animation-delay: 100ms; }
.hero-animate-delay-2 { animation-delay: 200ms; }
.hero-animate-delay-3 { animation-delay: 320ms; }
.hero-animate-delay-4 { animation-delay: 440ms; }

/* ─── Primary button ─── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-accent);
  color: #000;
  border: 1px solid transparent;
  border-radius: var(--radius);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  transition: filter var(--duration) var(--ease);
}
.btn-primary:hover { filter: brightness(0.88); }

/* ─── Secondary / ghost button ─── */
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  color: var(--color-fg-100);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  transition:
    border-color var(--duration) var(--ease),
    color var(--duration) var(--ease);
}
.btn-secondary:hover {
  border-color: var(--color-border-hover);
}
```

**Step 2: Build check**

```bash
npm run build 2>&1 | grep "Error\|error" | grep -v "node_modules" | head -20
```

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(css): new globals with fadeSlideUp, btn-primary, btn-secondary"
```

---

## Task 3: Global token rename pass

All components still reference old tokens (`--text-primary`, `--bg-card`, etc.). Do a bulk rename across the entire codebase.

**Files:** All `*.tsx` and `*.css` files in `components/`, `app/`

**Step 1: Run sed replacements**

```bash
cd /home/barni/Documents/leafmc/leafmc-website

# Background tokens
find components app -name "*.tsx" -o -name "*.css" | xargs sed -i \
  -e "s/var(--bg-page)/var(--color-background-100)/g" \
  -e "s/var(--bg-card)/var(--color-background-200)/g" \
  -e "s/var(--bg-elevated)/var(--color-background-300)/g"

# Border tokens
find components app -name "*.tsx" -o -name "*.css" | xargs sed -i \
  -e "s/var(--border-default)/var(--color-border)/g" \
  -e "s/var(--border-hover)/var(--color-border-hover)/g"

# Text tokens
find components app -name "*.tsx" -o -name "*.css" | xargs sed -i \
  -e "s/var(--text-primary)/var(--color-fg-100)/g" \
  -e "s/var(--text-secondary)/var(--color-fg-200)/g" \
  -e "s/var(--text-muted)/var(--color-fg-300)/g"

# Brand tokens
find components app -name "*.tsx" -o -name "*.css" | xargs sed -i \
  -e "s/var(--brand-subtle)/var(--color-accent-subtle)/g" \
  -e "s/var(--brand-border)/var(--color-accent-border)/g" \
  -e "s/var(--brand-glow-strong)/rgba(120, 194, 135, 0.55)/g" \
  -e "s/var(--brand-glow)/rgba(120, 194, 135, 0.3)/g" \
  -e "s/var(--brand)/var(--color-accent)/g"

# Radius tokens (keep --radius, rename others)
find components app -name "*.tsx" -o -name "*.css" | xargs sed -i \
  -e "s/var(--radius-xl)/var(--radius-lg)/g" \
  -e "s/var(--radius-md)/var(--radius)/g"
  # --radius-sm stays the same
  # --radius-lg stays the same
```

**Step 2: Build to verify no broken references**

```bash
npm run build 2>&1 | tail -15
```

Expected: clean build (exit code 0).

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor(tokens): bulk rename all components to new token system"
```

---

## Task 4: Rewrite Navbar

**Files:**
- Modify: `components/ui/Navbar.tsx`
- Modify: `components/ui/LanguageSwitcher.tsx`

**Step 1: Rewrite Navbar.tsx**

Replace the entire file. The floating pill becomes a full-width sticky bar with `border-bottom`. Keep the mobile hamburger and dropdown (already implemented).

```tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import type { NavConfig } from '@/content/nav'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar({ config }: { config: NavConfig }) {
  const locale = useLocale()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--space-3)',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}
      >
        {/* Logo */}
        <Link
          href={`/${locale}`}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          <Image src="/logo.svg" alt={config.logo.text} width={22} height={22} priority />
        </Link>

        {/* Nav links — hidden on mobile */}
        <div className="nav-links" style={{ display: 'flex', gap: 'var(--space-3)', flex: 1 }}>
          {config.links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              prefetch={link.href.startsWith('/docs') ? false : undefined}
              style={{
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-fg-200)',
                transition: 'color var(--duration) var(--ease)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side — hidden on mobile */}
        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <LanguageSwitcher />
          <a
            href={config.social.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-fg-200)',
              transition: 'color var(--duration) var(--ease)',
            }}
          >
            GitHub
          </a>
          <a
            href={config.social.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '6px 12px' }}
          >
            Discord
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          style={{
            display: 'none',
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-fg-100)',
            padding: '4px',
          }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            background: 'rgba(10,10,10,0.95)',
            padding: 'var(--space-2) var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {config.links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              onClick={() => setOpen(false)}
              style={{
                textDecoration: 'none',
                padding: '10px 0',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-fg-200)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-1)', alignItems: 'center' }}>
            <LanguageSwitcher />
            <a
              href={config.social.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-200)', textDecoration: 'none' }}
            >
              GitHub
            </a>
            <a
              href={config.social.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '6px 12px' }}
            >
              Discord
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
```

**Step 2: Update LanguageSwitcher to use new tokens**

In `components/ui/LanguageSwitcher.tsx`, replace all old token references:
- `var(--text-secondary)` → `var(--color-fg-200)`
- `var(--text-muted)` → `var(--color-fg-300)`
- `var(--bg-elevated)` → `var(--color-background-300)`
- `var(--border-default)` → `var(--color-border)`
- `var(--brand)` → `var(--color-accent)`
- `rgba(120,194,135,0.08)` → `var(--color-accent-subtle)`
- `borderRadius: '8px'` → `borderRadius: 'var(--radius)'`
- `borderRadius: '6px'` → `borderRadius: 'var(--radius)'`
- `borderRadius: '5px'` → `borderRadius: 'var(--radius-sm)'`

**Step 3: Build check**

```bash
npm run build 2>&1 | tail -10
```

**Step 4: Commit**

```bash
git add components/ui/Navbar.tsx components/ui/LanguageSwitcher.tsx
git commit -m "feat(navbar): full-width sticky bar, new token system"
```

---

## Task 5: Rewrite Hero (split layout + terminal)

**Files:**
- Modify: `components/marketing/Hero.tsx`
- Create: `components/marketing/HeroTerminal.tsx`

**Step 1: Create HeroTerminal.tsx**

A static terminal window showing a synthetic server startup log:

```tsx
// components/marketing/HeroTerminal.tsx

const LINES = [
  { text: '$ java -jar leaf-server.jar --nogui', color: 'var(--color-fg-200)' },
  { text: '' },
  { text: 'Starting Leaf server...', color: 'var(--color-fg-300)' },
  { text: '[Server] Loading libraries, please wait...', color: 'var(--color-fg-300)' },
  { text: '[Server] Environment: Java 21 (OpenJDK 64-Bit)', color: 'var(--color-fg-300)' },
  { text: '' },
  { text: '[Leaf] Async entity tracking: enabled', color: 'var(--color-accent)' },
  { text: '[Leaf] Virtual thread executor: enabled', color: 'var(--color-accent)' },
  { text: '[Leaf] Petal optimizations: enabled', color: 'var(--color-accent)' },
  { text: '' },
  { text: '[Server] Done (1.847s)! For help, type "help"', color: 'var(--color-fg-100)' },
  { text: '> ', color: 'var(--color-fg-200)' },
]

export function HeroTerminal() {
  return (
    <div
      style={{
        background: '#000',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 16px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-background-200)',
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e5484d', flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f76b15', flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#78c287', flexShrink: 0 }} />
        <span
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-fg-300)',
            letterSpacing: '0.04em',
          }}
        >
          leaf-server.jar
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '2px', minHeight: '220px' }}>
        {LINES.map((line, i) =>
          line.text === '' ? (
            <div key={i} style={{ height: '8px' }} />
          ) : (
            <div
              key={i}
              style={{
                fontSize: 'var(--text-xs)',
                lineHeight: 'var(--leading-xs)',
                color: line.color ?? 'var(--color-fg-300)',
                whiteSpace: 'pre',
              }}
            >
              {line.text}
            </div>
          )
        )}
      </div>
    </div>
  )
}
```

**Step 2: Rewrite Hero.tsx**

Replace the entire file. Remove motion/react, AnimatedGradientBackground, TextEffect. Use split 12-col grid with CSS entrance animations.

```tsx
'use client'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { AnnouncementBadge } from './AnnouncementBadge'
import { HeroTerminal } from './HeroTerminal'
import type { HomeConfig } from '@/content/home'

export function Hero({ content }: { content: HomeConfig['hero'] }) {
  const hero = content

  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-3)',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 'var(--space-4)',
        alignItems: 'center',
      }}
    >
      {/* Left — cols 1-7 */}
      <div style={{ gridColumn: '1 / 8' }}>
        {hero.announcement.visible && (
          <div className="hero-animate" style={{ marginBottom: 'var(--space-2)' }}>
            <AnnouncementBadge text={hero.announcement.text} href={hero.announcement.href} />
          </div>
        )}

        <p
          className="hero-animate hero-animate-delay-1"
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-fg-300)',
            margin: '0 0 var(--space-2)',
          }}
        >
          Open Source · Paper Fork
        </p>

        <h1
          className="hero-animate hero-animate-delay-2"
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            color: 'var(--color-fg-100)',
            margin: '0 0 var(--space-2)',
          }}
        >
          {hero.headline}
        </h1>

        <p
          className="hero-animate hero-animate-delay-3"
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-fg-200)',
            lineHeight: 'var(--leading-base)',
            margin: '0 0 var(--space-4)',
            maxWidth: '420px',
          }}
        >
          {hero.subheadline}
        </p>

        <div
          className="hero-animate hero-animate-delay-4"
          style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}
        >
          <Link href={hero.cta.primary.href} className="btn-primary">
            <Download size={14} />
            {hero.cta.primary.label}
          </Link>
          <Link href={hero.cta.secondary.href} prefetch={false} className="btn-secondary">
            {hero.cta.secondary.label} →
          </Link>
        </div>
      </div>

      {/* Right — cols 8-12 */}
      <div
        className="hero-animate hero-animate-delay-3"
        style={{ gridColumn: '8 / 13' }}
      >
        <HeroTerminal />
      </div>
    </section>
  )
}
```

**Step 3: Simplify AnnouncementBadge — remove motion/react**

Replace `components/marketing/AnnouncementBadge.tsx` entirely:

```tsx
'use client'
import Link from 'next/link'
import { FlaskConical, ChevronRight } from 'lucide-react'

interface Props { text: string; href?: string }

export function AnnouncementBadge({ text, href }: Props) {
  const badge = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '999px',
        border: '1px solid var(--color-accent-border)',
        padding: '4px 12px',
        fontSize: 'var(--text-xs)',
        fontWeight: 500,
        background: 'var(--color-accent-subtle)',
        color: 'var(--color-accent)',
        cursor: href ? 'pointer' : 'default',
      }}
    >
      <FlaskConical size={11} strokeWidth={1.5} />
      {text}
      {href && <ChevronRight size={11} strokeWidth={2} style={{ opacity: 0.6 }} />}
    </span>
  )
  if (href) return <Link href={href} style={{ textDecoration: 'none' }}>{badge}</Link>
  return badge
}
```

**Step 4: Remove motion/react + layout imports from Hero (update layout.tsx)**

In `app/[locale]/layout.tsx`, remove `GatedContent` wrapper (no longer needed — no animation gate):

```tsx
// Remove GatedContent import and wrapper. The layout body should be:
<body>
  <Preloader />
  <NextIntlClientProvider locale={locale} messages={messages}>
    {children}
  </NextIntlClientProvider>
</body>
```

> Actually, also remove Preloader since there are no entrance animations to gate. The body becomes simply:

```tsx
<body>
  <NextIntlClientProvider locale={locale} messages={messages}>
    {children}
  </NextIntlClientProvider>
</body>
```

Remove both `Preloader` and `GatedContent` imports.

**Step 5: Build check**

```bash
npm run build 2>&1 | tail -10
```

**Step 6: Commit**

```bash
git add components/marketing/Hero.tsx \
        components/marketing/HeroTerminal.tsx \
        components/marketing/AnnouncementBadge.tsx \
        app/[locale]/layout.tsx
git commit -m "feat(hero): split layout with terminal, CSS entrance animations, remove motion"
```

---

## Task 6: Restyle Features

**Files:**
- Modify: `components/marketing/Features.tsx`

**Step 1: Replace entire file**

Remove `GlowingEffect`. Add hover border via CSS class. Reduce top padding from 140px to `var(--space-8)`.

```tsx
'use client'
import { Zap, Plug, Settings, type LucideIcon } from 'lucide-react'
import type { HomeConfig } from '@/content/home'

const iconMap: Record<string, LucideIcon> = { Zap, Plug, Settings }

export function Features({ content }: { content: HomeConfig['features'] }) {
  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 var(--space-3) var(--space-8)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-2)',
          listStyle: 'none',
          padding: 'var(--space-8) 0 0',
          margin: 0,
        }}
      >
        {content.map((feature) => {
          const Icon = iconMap[feature.icon] ?? Zap
          return (
            <li key={feature.title}>
              <div
                style={{
                  height: '100%',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background-200)',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  transition: 'border-color var(--duration) var(--ease)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              >
                <div
                  style={{
                    width: 'fit-content',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-background-300)',
                    padding: '8px',
                    color: 'var(--color-accent)',
                  }}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 600,
                      color: 'var(--color-fg-100)',
                      margin: '0 0 var(--space-1)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-fg-200)',
                      lineHeight: 'var(--leading-base)',
                      margin: 0,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
```

**Step 2: Build check**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add components/marketing/Features.tsx
git commit -m "feat(features): remove GlowingEffect, flat bordered cards with hover"
```

---

## Task 7: Restyle Comparison (uniform stat cards)

**Files:**
- Modify: `components/marketing/Comparison.tsx`

**Step 1: Replace StatCard to use uniform styling (no per-card bg colors)**

In `Comparison.tsx`, update `StatCard`:
- Remove `card.bg` — all cards use `var(--color-background-200)`
- Remove the per-card SVG decorations
- Add hover border transition
- Remove `borderRadius: 'var(--radius-xl)'` → `var(--radius)`

Replace the `StatCard` function:

```tsx
function StatCard({ card }: { card: CardDef }) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: 0,
        background: 'var(--color-background-200)',
        borderRadius: 'var(--radius)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        border: '1px solid var(--color-border)',
        transition: 'border-color var(--duration) var(--ease)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
    >
      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-fg-300)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {card.title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, lineHeight: 1, color: 'var(--color-fg-100)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.04em' }}>
          {card.value}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'var(--color-accent-subtle)', border: '1px solid var(--color-accent-border)', borderRadius: '999px', padding: '2px 8px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>
          {card.star ? <Star size={10} strokeWidth={2} /> : <ArrowUp size={10} strokeWidth={2} />}
          {card.badge}
        </div>
      </div>

      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-300)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-1)', lineHeight: 1.5 }}>
        {card.comparison}
      </div>
    </div>
  )
}
```

Also update the `CardDef` interface — remove `bg` and `svg` fields since they're no longer used:

```tsx
interface CardDef {
  title: string
  value: string
  badge: string
  comparison: string
  star?: boolean
}
```

And remove all `bg` and `svg` properties from the `cards` array.

**Step 2: Update section header styles to use new tokens**

Section header `h2`: `fontSize: 'var(--text-2xl)'`, padding `var(--space-8)`.

**Step 3: Build check**

```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add components/marketing/Comparison.tsx
git commit -m "feat(comparison): uniform stat cards, new token system, hover borders"
```

---

## Task 8: Restyle Sponsors

**Files:**
- Modify: `components/marketing/Sponsors.tsx`

**Step 1: Replace entire file**

2-col layout (logos left, CTA right). Grayscale sponsor logos.

```tsx
import Image from 'next/image'
import type { HomeConfig } from '@/content/home'
import { OCBackers } from './OCBackers'

export function Sponsors({ content }: { content: HomeConfig['sponsors'] }) {
  const sponsors = content

  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-3)',
        borderTop: '1px solid var(--color-border)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 'var(--space-6)',
        alignItems: 'start',
      }}
    >
      {/* Left: title + logos + backers */}
      <div>
        <h2
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            color: 'var(--color-fg-100)',
            margin: '0 0 var(--space-4)',
            letterSpacing: '-0.02em',
          }}
        >
          {sponsors.title}
        </h2>

        {sponsors.gold.length > 0 && (
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>Gold</p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              {sponsors.gold.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" style={{ opacity: 0.7, transition: 'opacity var(--duration) var(--ease)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                >
                  <Image src={s.logo} alt={s.name} width={120} height={40} style={{ objectFit: 'contain', filter: 'grayscale(100%) brightness(1.4)' }} />
                </a>
              ))}
            </div>
          </div>
        )}

        {sponsors.silver.length > 0 && (
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>Silver</p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
              {sponsors.silver.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" style={{ opacity: 0.7, transition: 'opacity var(--duration) var(--ease)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                >
                  <Image src={s.logo} alt={s.name} width={80} height={30} style={{ objectFit: 'contain', filter: 'grayscale(100%) brightness(1.4)' }} />
                </a>
              ))}
            </div>
          </div>
        )}

        <OCBackers />
      </div>

      {/* Right: CTA */}
      <div style={{ paddingTop: 'var(--space-7)' }}>
        <a href={sponsors.cta.href} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          {sponsors.cta.label} →
        </a>
      </div>
    </section>
  )
}
```

**Step 2: Build check**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add components/marketing/Sponsors.tsx
git commit -m "feat(sponsors): 2-col layout, grayscale logos, btn-secondary CTA"
```

---

## Task 9: Restyle CommunityCTA

**Files:**
- Modify: `components/marketing/CommunityCTA.tsx`

**Step 1: Replace entire file**

Remove `FlickeringGrid`, `Image` logo with drop-shadow. Flat bordered box.

```tsx
import type { HomeConfig } from '@/content/home'

export function CommunityCTA({ content }: { content: HomeConfig['community'] }) {
  const community = content
  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-3) var(--space-8)' }}>
      <div
        style={{
          border: '1px solid var(--color-accent-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8) var(--space-5)',
          textAlign: 'center',
          background: 'var(--color-background-200)',
        }}
      >
        <p
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Community
        </p>
        <h2
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 600,
            color: 'var(--color-fg-100)',
            margin: '0 0 var(--space-2)',
            letterSpacing: '-0.03em',
          }}
        >
          {community.headline}
        </h2>
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-fg-200)',
            maxWidth: '400px',
            margin: '0 auto var(--space-4)',
            lineHeight: 'var(--leading-base)',
          }}
        >
          {community.subheadline}
        </p>
        <a
          href={community.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          {community.cta.label} →
        </a>
      </div>
    </section>
  )
}
```

**Step 2: Build check**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add components/marketing/CommunityCTA.tsx
git commit -m "feat(community-cta): remove FlickeringGrid, flat bordered box"
```

---

## Task 10: Update Contributors + OCBackers

These keep their structure but need token + styling cleanup.

**Files:**
- Modify: `components/marketing/Contributors.tsx`
- Modify: `components/marketing/OCBackers.tsx`

**Step 1: Update Contributors.tsx**

Changes needed:
1. Section `borderTop: '1px solid var(--color-border)'`
2. `h2` font: `fontSize: 'var(--text-xl)'`, `letterSpacing: '-0.02em'`
3. Tooltip: remove `boxShadow`, use `background: 'var(--color-background-300)'`
4. Avatar `filter` on hover: remove `drop-shadow`, keep scale only

In the `<section>` opening tag, add `borderTop: '1px solid var(--color-border)'` to the style.

In the `h2`:
```tsx
<h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-fg-100)', marginBottom: 'var(--space-5)', letterSpacing: '-0.02em' }}>
```

In the tooltip `<div>` (line ~160):
```tsx
style={{
  // ... keep position/transform/padding/fontSize/whiteSpace/pointerEvents/zIndex
  background: 'var(--color-background-300)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  // remove boxShadow
}}
```

Avatar on hover — remove `filter: isHovered ? 'drop-shadow(...)' : 'none'`.

**Step 2: Update OCBackers.tsx**

Same changes:
- Tooltip: `background: 'var(--color-background-300)'`, `border: '1px solid var(--color-border)'`, no `boxShadow`
- Remove avatar hover `filter` (drop-shadow)
- Label `fontSize: 'var(--text-xs)'`, `color: 'var(--color-fg-300)'`

**Step 3: Build check**

```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add components/marketing/Contributors.tsx components/marketing/OCBackers.tsx
git commit -m "feat(contributors): border-top, new token system, remove hover drop-shadow"
```

---

## Task 11: Rewrite Footer (3-column layout)

**Files:**
- Modify: `components/ui/Footer.tsx`

**Step 1: Replace entire file**

Remove `TextHoverEffect` import. 3-column layout.

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { getNavConfig } from '@/lib/config'

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
    </svg>
  )
}

export function Footer() {
  const nav = getNavConfig()
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-7) 0 var(--space-5)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--space-3)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 'var(--space-5)',
          alignItems: 'start',
        }}
      >
        {/* Col 1: Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
            <Image src="/logo.svg" alt="Leaf" width={20} height={20} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-fg-100)' }}>Leaf</span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-300)', lineHeight: 'var(--leading-base)', margin: '0 0 var(--space-3)' }}>
            A Paper fork focused on performance, vanilla behavior, and stability.
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-400)', margin: 0 }}>
            © {new Date().getFullYear()} Winds Studio · MIT License
          </p>
        </div>

        {/* Col 2: Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-fg-300)', margin: 0 }}>
            Resources
          </p>
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-200)', textDecoration: 'none', transition: 'color var(--duration) var(--ease)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Col 3: Social */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-fg-300)', margin: 0 }}>
            Community
          </p>
          <a href={nav.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-fg-200)', textDecoration: 'none', transition: 'color var(--duration) var(--ease)' }}
          >
            <GitHubIcon /> GitHub
          </a>
          <a href={nav.social.discord} target="_blank" rel="noopener noreferrer" aria-label="Discord"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-fg-200)', textDecoration: 'none', transition: 'color var(--duration) var(--ease)' }}
          >
            <DiscordIcon /> Discord
          </a>
        </div>
      </div>
    </footer>
  )
}
```

**Step 2: Build check**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add components/ui/Footer.tsx
git commit -m "feat(footer): 3-column layout, logo + description + links + social"
```

---

## Task 12: Restyle Download page

**Files:**
- Modify: `components/download/DownloadPage.tsx`
- Modify: `components/download/BuildCard.tsx`
- Modify: `components/download/VersionDropdown.tsx`

**Step 1: Update DownloadPage.tsx token references**

Replace all old tokens with new ones. Key changes:
- `var(--text-primary)` → `var(--color-fg-100)`
- `var(--text-secondary)` → `var(--color-fg-200)`
- `var(--bg-card)` → `var(--color-background-200)`
- `var(--border-default)` → `var(--color-border)`
- Font sizes: `40px` → `var(--text-2xl)`, `16px` → `var(--text-base)`, etc.
- Warning/info banners: use `var(--color-warning)`, `var(--color-info)` borders

Full updated `<main>` wrapper padding:
```tsx
<main style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-8) var(--space-3)' }}>
```

**Step 2: Update BuildCard.tsx**

Replace both card variants:

**Regular card:**
```tsx
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    padding: 'var(--space-2) var(--space-3)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    background: 'transparent',
    marginBottom: '6px',
    transition: 'border-color var(--duration) var(--ease)',
  }}
  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-hover)')}
  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
>
```

- Build number: `fontSize: 'var(--text-sm)'`, `color: 'var(--color-fg-300)'`
- Summary: `fontSize: 'var(--text-sm)'`, `color: 'var(--color-fg-100)'`
- Download link: replace with `className="btn-secondary"` at small size (`padding: '5px 12px'`)

**Highlight (latest) card:**
```tsx
<div
  ref={cardRef}
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    padding: 'var(--space-3)',
    border: '1px solid var(--color-accent-border)',
    borderRadius: 'var(--radius)',
    background: 'var(--color-background-200)',
    marginBottom: '8px',
  }}
>
```

- Remove `CanvasRevealEffect`
- LATEST badge: `background: 'var(--color-accent-subtle)'`, `border: '1px solid var(--color-accent-border)'`, `color: 'var(--color-accent)'`
- Download button: replace `<ShimmerButton>` with `<a className="btn-primary" href={downloadUrl} download>`

**Step 3: Update VersionDropdown.tsx token references**

Replace `var(--text-muted)` → `var(--color-fg-300)`. Remove `MotionConfig` + spring animation — replace `AnimatePresence/motion.div` dropdown with a simple CSS `transition: opacity`:

```tsx
// Replace AnimatePresence/motion with plain div:
{open && (
  <div
    style={{
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      right: 0,
      background: 'var(--color-background-300)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      zIndex: 50,
    }}
  >
    {versions.map((v) => ( /* ... */ ))}
  </div>
)}
```

**Step 4: Build check**

```bash
npm run build 2>&1 | tail -10
```

Expected: clean build.

**Step 5: Commit**

```bash
git add components/download/DownloadPage.tsx \
        components/download/BuildCard.tsx \
        components/download/VersionDropdown.tsx
git commit -m "feat(download): new token system, remove ShimmerButton/CanvasReveal, flat cards"
```

---

## Task 13: Cleanup — delete removed components

**Files to delete:**
- `components/ui/animated-gradient-background.tsx`
- `components/ui/flickering-grid.tsx`
- `components/ui/canvas-reveal-effect.tsx`
- `components/ui/glowing-effect.tsx`
- `components/ui/ShimmerButton.tsx`
- `components/ui/text-effect.tsx`
- `components/ui/letter-swap.tsx`
- `components/ui/GatedContent.tsx`
- `components/ui/Preloader.tsx`

**Files to update (docs components — use old tokens that are now renamed):**
- `components/docs/BenchmarkGraph.tsx` — replace all old tokens
- `components/docs/ConfigViewer.tsx` — replace all old tokens
- `components/docs/VersionBadge.tsx` — replace all old tokens
- `app/[locale]/not-found.tsx` — replace all old tokens
- `components/ui/Spinner.tsx` — replace all old tokens

**Step 1: Delete removed files**

```bash
cd /home/barni/Documents/leafmc/leafmc-website
rm components/ui/animated-gradient-background.tsx \
   components/ui/flickering-grid.tsx \
   components/ui/canvas-reveal-effect.tsx \
   components/ui/glowing-effect.tsx \
   components/ui/ShimmerButton.tsx \
   components/ui/text-effect.tsx \
   components/ui/letter-swap.tsx \
   components/ui/GatedContent.tsx \
   components/ui/Preloader.tsx
```

**Step 2: Fix any remaining import errors**

```bash
npm run build 2>&1 | grep "Cannot find module\|Module not found" | head -20
```

For each broken import found, open the file and remove or replace the import.

Most likely culprits:
- `app/[locale]/layout.tsx` — already cleaned up in Task 5 (Preloader + GatedContent removed)
- Any docs component importing deleted UI files

**Step 3: Update docs components with new token names**

In `components/docs/BenchmarkGraph.tsx`, `components/docs/ConfigViewer.tsx`, `components/docs/VersionBadge.tsx`, `app/[locale]/not-found.tsx`, `components/ui/Spinner.tsx`:

```bash
find components/docs app/[locale]/not-found.tsx components/ui/Spinner.tsx \
  -name "*.tsx" | xargs sed -i \
  -e "s/var(--bg-page)/var(--color-background-100)/g" \
  -e "s/var(--bg-card)/var(--color-background-200)/g" \
  -e "s/var(--bg-elevated)/var(--color-background-300)/g" \
  -e "s/var(--border-default)/var(--color-border)/g" \
  -e "s/var(--border-hover)/var(--color-border-hover)/g" \
  -e "s/var(--text-primary)/var(--color-fg-100)/g" \
  -e "s/var(--text-secondary)/var(--color-fg-200)/g" \
  -e "s/var(--text-muted)/var(--color-fg-300)/g" \
  -e "s/var(--brand)/var(--color-accent)/g"
```

**Step 4: Final build check — must be clean**

```bash
npm run build 2>&1 | tail -20
```

Expected: exit code 0, same page count as before (119 pages).

**Step 5: Commit**

```bash
git add -A
git commit -m "feat(cleanup): delete removed animation components, update docs token references"
```

---

## Final Verification

```bash
npm run build
```

Confirm:
- Exit code 0
- 119 pages generated
- No TypeScript errors
- No "Cannot find module" errors
