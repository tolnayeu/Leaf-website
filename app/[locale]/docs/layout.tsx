import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { source } from '@/lib/source'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { ArrowLeft, Home } from 'lucide-react'
import 'fumadocs-ui/style.css'

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const tree = source.getPageTree(locale)

  const title = (
    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Image
        src="/logo.svg"
        alt="Leaf"
        width={20}
        height={20}
        style={{ filter: 'drop-shadow(0 0 5px rgba(120,194,135,0.55))' }}
      />
      Leaf Docs
    </span>
  )

  const locales = [
    { name: 'English',    locale: 'en' },
    { name: 'Deutsch',    locale: 'de' },
    { name: 'Türkçe',     locale: 'tr' },
    { name: 'Português',  locale: 'pt' },
    { name: 'Русский',    locale: 'ru' },
    { name: '中文',        locale: 'zh' },
  ]

  return (
    <RootProvider i18n={{ locale, locales }}>
      <style>{`
        /* ── Hide homepage guide lines in docs ── */
        body::before, body::after { display: none !important; }

        /* ── Hide theme toggle ── */
        [aria-label="Toggle theme"],
        [data-theme-toggle],
        #nd-sidebar button[class*="theme"],
        #nd-nav button[class*="theme"] { display: none !important; }

        /* ── Map fumadocs tokens to our design system ── */
        :root,
        .dark {
          --color-fd-background:          #0a0a0a;
          --color-fd-foreground:          #ededed;
          --color-fd-muted:               #111111;
          --color-fd-muted-foreground:    #6f6f6f;
          --color-fd-popover:             #111111;
          --color-fd-popover-foreground:  #ededed;
          --color-fd-card:                #111111;
          --color-fd-card-foreground:     #ededed;
          --color-fd-border:              #2e2e2e;
          --color-fd-input:               #2e2e2e;
          --color-fd-ring:                rgba(120,194,135,0.4);
          --color-fd-primary:             #78c287;
          --color-fd-primary-foreground:  #000;
          --color-fd-secondary:           #1a1a1a;
          --color-fd-secondary-foreground:#ededed;
          --color-fd-accent:              #1a1a1a;
          --color-fd-accent-foreground:   #ededed;

          /* Kill all border-radius */
          --radius-fd: 0px;
        }

        /* ── Global reset for docs ── */
        #nd-docs-layout * {
          border-radius: 0 !important;
        }
        /* Keep pill badges readable */
        #nd-docs-layout [class*="rounded-full"] {
          border-radius: 999px !important;
        }

        /* ── Sidebar ── */
        #nd-sidebar {
          background: #0a0a0a;
          border-right: 1px solid #2e2e2e;
          font-family: var(--font-geist-sans), system-ui, sans-serif;
          font-size: 13px;
        }

        /* Sidebar nav header */
        #nd-sidebar header {
          border-bottom: 1px solid #2e2e2e;
          background: #0a0a0a;
          padding: 0 16px;
          height: 56px;
          display: flex;
          align-items: center;
        }

        /* Active page item */
        #nd-sidebar [data-active="true"] {
          color: #78c287 !important;
          background: rgba(120,194,135,0.07) !important;
          font-weight: 500;
        }
        #nd-sidebar [data-active="true"]:hover {
          background: rgba(120,194,135,0.1) !important;
        }
        #nd-sidebar [data-active="true"]::before {
          background: #78c287 !important;
        }

        /* Sidebar items hover (exclude header logo and footer home link) */
        #nd-sidebar nav a:not([data-active="true"]):hover,
        #nd-sidebar nav button:hover {
          background: rgba(255,255,255,0.04) !important;
          color: #ededed !important;
        }

        /* Kill any background on the logo/title link and home link */
        #nd-sidebar header a:hover,
        #nd-sidebar footer a:hover,
        .sidebar-home-link:hover {
          background: transparent !important;
        }

        /* Sidebar section headings */
        #nd-sidebar .text-fd-muted-foreground {
          color: #6f6f6f;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* Sidebar footer */
        #nd-sidebar footer {
          border-top: 1px solid #2e2e2e;
          background: #0a0a0a;
        }

        /* Home link */
        .sidebar-home-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #6f6f6f;
          text-decoration: none;
          transition: color 150ms ease;
        }
        .sidebar-home-link:hover { color: #ededed; }

        /* ── Top navbar (docs) ── */
        #nd-subnav,
        header[id="nd-nav"] {
          background: rgba(10,10,10,0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #2e2e2e;
          height: 56px;
        }

        /* ── Content area ── */
        #nd-page {
          background: #0a0a0a;
        }

        /* Article typography */
        #nd-page article {
          font-family: var(--font-geist-sans), system-ui, sans-serif;
          font-size: 15px;
          line-height: 24px;
          color: #a1a1a1;
          max-width: 680px;
        }

        #nd-page article h1,
        #nd-page article h2,
        #nd-page article h3,
        #nd-page article h4 {
          color: #ededed;
          font-weight: 600;
          letter-spacing: -0.02em;
          border-bottom: 1px solid #2e2e2e;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }

        #nd-page article h1 { font-size: 28px; line-height: 1.1; }
        #nd-page article h2 { font-size: 20px; margin-top: 40px; }
        #nd-page article h3 { font-size: 16px; margin-top: 32px; border-bottom: none; padding-bottom: 0; }
        #nd-page article h4 { font-size: 14px; margin-top: 24px; border-bottom: none; padding-bottom: 0; }

        #nd-page article p { color: #a1a1a1; margin: 12px 0; }

        #nd-page article a {
          color: #78c287;
          text-decoration: none;
          border-bottom: 1px solid rgba(120,194,135,0.3);
          transition: border-color 150ms ease;
        }
        #nd-page article a:hover { border-color: #78c287; }

        /* Code */
        #nd-page article code:not(pre code) {
          background: #1a1a1a;
          border: 1px solid #2e2e2e;
          color: #78c287;
          font-family: var(--font-geist-mono), monospace;
          font-size: 12px;
          padding: 1px 6px;
        }

        #nd-page article pre {
          background: #111111 !important;
          border: 1px solid #2e2e2e !important;
          font-family: var(--font-geist-mono), monospace;
          font-size: 13px;
          line-height: 1.6;
          overflow-x: auto;
          margin: 20px 0;
        }

        /* Blockquote */
        #nd-page article blockquote {
          border-left: 2px solid #78c287;
          padding-left: 16px;
          color: #6f6f6f;
          margin: 16px 0;
          font-style: normal;
        }

        /* Tables */
        #nd-page article table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          margin: 20px 0;
        }
        #nd-page article th {
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #6f6f6f;
          border-bottom: 1px solid #2e2e2e;
          padding: 8px 12px;
        }
        #nd-page article td {
          padding: 8px 12px;
          border-bottom: 1px solid #1a1a1a;
          color: #a1a1a1;
        }

        /* Lists */
        #nd-page article ul,
        #nd-page article ol {
          margin: 12px 0;
          padding-left: 24px;
          color: #a1a1a1;
        }
        #nd-page article ul { list-style: disc; }
        #nd-page article ol { list-style: decimal; }
        #nd-page article li { margin: 4px 0; line-height: 1.6; }
        #nd-page article li::marker { color: #78c287; }
        #nd-page article ul ul,
        #nd-page article ol ol,
        #nd-page article ul ol,
        #nd-page article ol ul { margin: 4px 0; }

        /* Horizontal rule */
        #nd-page article hr {
          border: none;
          border-top: 1px solid #2e2e2e;
          margin: 32px 0;
        }

        /* Images */
        #nd-page article img {
          max-width: 100%;
          height: auto;
          border: 1px solid #2e2e2e;
          margin: 20px 0;
        }

        /* Inline emphasis */
        #nd-page article strong { color: #ededed; font-weight: 600; }
        #nd-page article em { color: #c1c1c1; font-style: italic; }

        /* Callouts / admonitions */
        #nd-page article .nd-callout,
        #nd-page article [class*="callout"] {
          border-left: 2px solid #2e2e2e;
          background: #111111;
          padding: 14px 16px;
          margin: 20px 0;
          font-size: 14px;
        }

        /* ── TOC (right sidebar) ── */
        #nd-toc {
          font-family: var(--font-geist-sans), system-ui, sans-serif;
          font-size: 12px;
          border-left: 1px solid #2e2e2e;
          background: #0a0a0a;
          padding-left: 24px;
        }
        #nd-toc a { color: #6f6f6f; text-decoration: none; transition: color 150ms ease; }
        #nd-toc a:hover { color: #ededed; }
        #nd-toc a[data-active="true"] { color: #78c287; }

        /* ── Sidebar footer: home + lang in one row ── */
        /* The fumadocs container has flex-col with [icons-div, footer] as children.
           Use :has() to flip it to flex-row so home link is left, lang toggle is right. */
        #nd-sidebar div:has(> .sidebar-home-link) {
          flex-direction: row !important;
          align-items: center !important;
          padding: 10px 16px !important;
        }
        /* Home link: first in visual order */
        #nd-sidebar .sidebar-home-link {
          order: 1;
          flex: 1;
        }
        /* Icons div (contains language toggle): push to right */
        #nd-sidebar div:has(> .sidebar-home-link) > div {
          order: 2;
          margin-left: auto;
          flex: 0 0 auto;
        }

        /* ── Language toggle button ── */
        #nd-sidebar [aria-label="Choose a language"] {
          color: #6f6f6f;
          transition: color 150ms ease;
        }
        #nd-sidebar [aria-label="Choose a language"]:hover {
          color: #ededed;
          background: rgba(255,255,255,0.04) !important;
        }

        /* Popover content */
        [data-radix-popper-content-wrapper] > div {
          background: #0e0e0e !important;
          border: 1px solid #2e2e2e !important;
          border-radius: 0 !important;
          backdrop-filter: none !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.6) !important;
          min-width: 164px !important;
          padding: 4px !important;
        }

        /* Popover label */
        [data-radix-popper-content-wrapper] > div p {
          font-size: 10px !important;
          font-weight: 600 !important;
          letter-spacing: 0.06em !important;
          text-transform: uppercase !important;
          color: #6f6f6f !important;
          padding: 6px 8px 4px !important;
          margin: 0 !important;
        }

        /* Locale items */
        [data-radix-popper-content-wrapper] > div button {
          border-radius: 0 !important;
          font-family: var(--font-geist-sans), system-ui, sans-serif !important;
          font-size: 13px !important;
          padding: 8px 10px !important;
          transition: background 100ms ease, color 100ms ease !important;
        }

        /* Active locale */
        [data-radix-popper-content-wrapper] > div button.bg-fd-primary\/10 {
          background: rgba(120,194,135,0.08) !important;
          color: #78c287 !important;
        }

        /* Hover locale */
        [data-radix-popper-content-wrapper] > div button:not(.bg-fd-primary\/10):hover {
          background: rgba(255,255,255,0.05) !important;
          color: #ededed !important;
        }

        /* Scrollbar */
        #nd-sidebar ::-webkit-scrollbar,
        #nd-page ::-webkit-scrollbar { width: 4px; }
        #nd-sidebar ::-webkit-scrollbar-track,
        #nd-page ::-webkit-scrollbar-track { background: transparent; }
        #nd-sidebar ::-webkit-scrollbar-thumb,
        #nd-page ::-webkit-scrollbar-thumb { background: #2e2e2e; }
      `}</style>
      <DocsLayout
        tree={tree}
        i18n
        nav={{ title }}
        sidebar={{
          footer: (
            <Link href={`/${locale}`} className="sidebar-home-link">
              <ArrowLeft size={13} strokeWidth={2} />
              <Home size={13} strokeWidth={2} />
              Home
            </Link>
          ),
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  )
}
