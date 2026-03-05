# LeafMC Website — Geist Redesign Design Document

**Date:** 2026-03-05
**Approach:** Option B — Geist-principled, brand-adapted
**Scope:** Full ground-up redesign (all pages, all components)

---

## Goals

Replace the current animation-heavy, ad-hoc dark SaaS aesthetic with a strict Geist-principled design system: 8px spacing grid, defined typographic scale, border-driven composition, and brand green as the sole accent. Remove all canvas/RAF effects. Motion lives in CSS only.

---

## 1. Design Tokens (`styles/tokens.css`)

Replace the current token file entirely with this system:

### Colors

```css
:root {
  /* Backgrounds */
  --color-background-100: #0a0a0a;   /* page */
  --color-background-200: #111111;   /* card */
  --color-background-300: #1a1a1a;   /* elevated */

  /* Borders */
  --color-border:         #2e2e2e;
  --color-border-hover:   #444444;

  /* Foreground */
  --color-fg-100: #ededed;   /* primary text */
  --color-fg-200: #a1a1a1;   /* secondary */
  --color-fg-300: #6f6f6f;   /* muted */
  --color-fg-400: #444444;   /* decorative / very muted */

  /* Accent (brand green — unchanged) */
  --color-accent:         #78c287;
  --color-accent-subtle:  rgba(120, 194, 135, 0.08);
  --color-accent-border:  rgba(120, 194, 135, 0.2);

  /* Semantic */
  --color-success: #78c287;
  --color-error:   #e5484d;
  --color-warning: #f76b15;
  --color-info:    #3b9edd;
}
```

**Migration map from old tokens:**
- `--bg-page` → `--color-background-100`
- `--bg-card` → `--color-background-200`
- `--bg-elevated` → `--color-background-300`
- `--border-default` → `--color-border`
- `--border-hover` → `--color-border-hover`
- `--text-primary` → `--color-fg-100`
- `--text-secondary` → `--color-fg-200`
- `--text-muted` → `--color-fg-300`
- `--brand` → `--color-accent`
- `--brand-subtle` → `--color-accent-subtle`
- `--brand-border` → `--color-accent-border`

### Typography

```css
:root {
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;

  /* Size scale */
  --text-xs:   11px;  --leading-xs:   16px;
  --text-sm:   13px;  --leading-sm:   20px;   /* UI default */
  --text-base: 15px;  --leading-base: 24px;   /* body copy */
  --text-lg:   18px;  --leading-lg:   28px;
  --text-xl:   24px;  --leading-xl:   32px;
  --text-2xl:  32px;  --leading-2xl:  40px;
  --text-3xl:  clamp(32px, 5vw, 48px);  /* hero headline only */
}
```

### Spacing (8px base unit)

```css
:root {
  --space-1:  8px;
  --space-2:  16px;
  --space-3:  24px;
  --space-4:  32px;
  --space-5:  48px;
  --space-6:  64px;
  --space-7:  80px;
  --space-8:  96px;
  --space-9:  128px;
}
```

Section vertical padding: `--space-8` (96px) desktop / `--space-6` (64px) mobile.

### Border Radius

```css
:root {
  --radius-sm: 4px;
  --radius:    8px;   /* default for all cards/buttons */
  --radius-lg: 12px;  /* terminal block, large containers */
}
```

### Motion

```css
:root {
  --duration-fast:  100ms;
  --duration:       150ms;
  --duration-base:  300ms;
  --ease:           ease;
  --ease-out:       cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 2. Layout System

### Grid

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-3);   /* 24px sides */
}

/* 12-column grid — used for hero split and multi-column sections */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-3);   /* 24px */
}
```

Mobile: padding collapses to `--space-2` (16px). Grid stacks to single column.

### Navbar

Full-width sticky bar, not a floating pill:

```
position: sticky; top: 0; z-index: 50;
height: 56px;
border-bottom: 1px solid var(--color-border);
background: rgba(10,10,10,0.85);
backdrop-filter: blur(12px);
```

Logo left. Nav links center. GitHub + Discord right. No scroll-triggered resizing.

### Section Dividers

Every section is separated by `border-top: 1px solid var(--color-border)` (not spacing gaps). This is the Geist/Vercel pattern — structure via lines, not air.

### Page Section Order (Home)

1. Hero (split layout, 7-col / 5-col)
2. Features (3-col card grid)
3. Performance stats (4-col) + benchmark tabs
4. Sponsors (2-col: logos left, CTA right)
5. Contributors (avatar row)
6. Community CTA (full-width bordered box)
7. Footer (3-col: brand / links / social)

---

## 3. Component Specifications

### Navbar

- `height: 56px`
- Full-width sticky, `border-bottom`
- Left: Logo (image only, no text), 24px
- Center: Docs, Download nav links (`--text-sm`, `--color-fg-200`, hover `--color-fg-100`)
- Right: Language switcher, GitHub link, Discord button (solid `--color-accent` bg)
- Mobile: hamburger → full-width dropdown below bar

### Hero

Split layout using 12-column grid:

**Left (cols 1-7):**
- Eyebrow: `OPEN SOURCE · PAPER FORK` — `--text-xs`, uppercase, `--color-fg-300`, `letter-spacing: 0.08em`
- Announcement badge (kept, simplified)
- H1: `clamp(32px, 5vw, 48px)`, weight 700, `letter-spacing: -0.04em`, `--color-fg-100`
- Subheadline: `--text-base`, `--color-fg-200`, max-width 420px
- CTAs: Primary (solid green) + Secondary (ghost border)
- Entrance animation: `@keyframes fadeSlideUp` (300ms, once on load)

**Right (cols 8-12):**
- Dark terminal window: `background: #000`, `border: 1px solid --color-border`, `border-radius: --radius-lg`
- Header bar: 3 traffic-light dots + `leaf-server.jar` filename in `--color-fg-300`
- Content: synthetic server startup log in `--font-mono` `--text-xs` / `--text-sm`
- Static content (no typewriter animation)

### Feature Cards

3 cards in a grid. Each card:
- `border: 1px solid var(--color-border)`
- `background: var(--color-background-200)`
- `border-radius: var(--radius)`
- `padding: var(--space-4)` (32px)
- Hover: `border-color: var(--color-border-hover)`, `transition: border-color var(--duration) var(--ease)`
- Icon: 32px box with `--color-accent`, `border: 1px solid var(--color-border)`, `border-radius: var(--radius-sm)`, icon `strokeWidth={1.5}`
- Title: `--text-lg`, weight 600, `--color-fg-100`
- Body: `--text-sm`, `--color-fg-200`, `line-height: 1.6`

### Stat Cards (Performance section)

4-col uniform grid. Each card:
- `background: var(--color-background-200)`
- `border: 1px solid var(--color-border)`
- `border-radius: var(--radius)`
- `padding: var(--space-4)`
- No unique per-card colors (removes `#0d1f10`, `#0d1a2e`, etc.)
- Value: `--text-2xl`, weight 700, `--color-fg-100`, mono font
- Badge: `--color-accent-subtle` bg, `--color-accent-border` border, `--color-accent` text
- Comparison note: `--text-xs`, `--color-fg-300`

### Button — Primary

```css
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
  transition: filter var(--duration) var(--ease);
}
.btn-primary:hover { filter: brightness(0.9); }
```

### Button — Secondary (Ghost)

```css
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
  transition: border-color var(--duration) var(--ease), color var(--duration) var(--ease);
}
.btn-secondary:hover {
  border-color: var(--color-border-hover);
  color: var(--color-fg-100);
}
```

### Community CTA

Full-width bordered box (no flickering grid):
- `border: 1px solid var(--color-accent-border)`
- `border-radius: var(--radius-lg)`
- `background: var(--color-background-200)`
- `padding: var(--space-8) var(--space-5)` (96px / 48px)
- Centered: Logo → H2 → subtext → CTA button
- No `filter: drop-shadow` on logo

### Sponsors

2-col layout:
- Left (col 1-7): Section title + sponsor logos
- Right (col 8-12): Stat + CTA (or just the CTA)
- Sponsor logos: `<Image>` with `filter: grayscale(100%) brightness(1.4)` → removes on hover
- `border-top: 1px solid var(--color-border)`

### Contributors

Kept as-is structurally (avatar group). Visual changes:
- `border-top: 1px solid var(--color-border)`
- Tooltip uses `--color-background-300`, `--color-border`
- No drop-shadow filter on avatars

### Footer

3-column layout:
- Left (col 1-4): Leaf logo + one-line description + copyright
- Center (col 5-8): Nav links (vertical list, `--text-sm`)
- Right (col 9-12): GitHub + Discord (icon buttons)
- `border-top: 1px solid var(--color-border)`
- `padding: var(--space-8) 0 var(--space-5)`

### Download Page

- Version dropdown: keep functionality, restyle to match new token system. No spring animation — `transition: height var(--duration-base) var(--ease-out)`.
- Build cards: flat bordered list. Highlight card: `border-color: var(--color-accent-border)`. No `CanvasRevealEffect`. Latest badge: `--color-accent-subtle` bg. Download button: `.btn-primary`.

---

## 4. Motion Rules

1. **CSS-only.** No `requestAnimationFrame` animations on marketing pages.
2. **Interactions:** `transition` on hover/focus only. Never autoplay on marketing pages.
3. **Page entrance:** Hero H1 + subheadline + CTAs use `@keyframes fadeSlideUp` (one-time, CSS animation, no JS).
4. **Global transitions:** `border-color`, `color`, `opacity`, `filter` — `var(--duration) var(--ease)`.
5. **No `motion/react`** on pages where it can be removed. Keep for docs and download interactive elements only.

```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 5. Removed Components

These files are deleted entirely:

- `components/ui/animated-gradient-background.tsx`
- `components/ui/flickering-grid.tsx`
- `components/ui/canvas-reveal-effect.tsx`
- `components/ui/glowing-effect.tsx`
- `components/ui/ShimmerButton.tsx`
- `components/ui/text-effect.tsx`
- `components/ui/letter-swap.tsx`
- `components/ui/GatedContent.tsx` (no longer needed)
- `components/ui/Preloader.tsx` (no longer needed — no animation gate)
- `app/globals.css` button classes: `.gradient-btn`, `.shimmer-btn`, `.ghost-btn`, `.outline-btn`, `.community-cta-btn` (replaced by `.btn-primary`, `.btn-secondary`)

---

## 6. New Components / Files Created

- `styles/tokens.css` — replaced entirely with new system above
- `app/globals.css` — stripped to base + `.btn-primary` + `.btn-secondary` + `@keyframes fadeSlideUp`
- `components/marketing/HeroTerminal.tsx` — static terminal window component (server startup log)
- `components/ui/Navbar.tsx` — rewritten (full-width sticky bar)
- `components/ui/Footer.tsx` — rewritten (3-column layout)

All other components are modified in-place to use new tokens.

---

## 7. Implementation Order

1. **Tokens** — replace `styles/tokens.css` first; update all token references throughout
2. **Global CSS** — strip `globals.css`, add new button classes + keyframes
3. **Navbar** — rewrite to full-width sticky
4. **Hero** — new split layout + `HeroTerminal` component
5. **Features** — restyled cards (remove GlowingEffect, new hover)
6. **Comparison** — uniform stat cards, remove per-card colors
7. **Sponsors** — 2-col layout, grayscale logos
8. **Community CTA** — remove FlickeringGrid, flat styled box
9. **Contributors** — minor token updates
10. **Footer** — 3-column layout
11. **Download page** — restyled cards + buttons
12. **Cleanup** — delete removed component files, remove Preloader from layout
