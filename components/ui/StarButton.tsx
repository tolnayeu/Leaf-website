'use client'
import React, { useRef, useEffect, ReactNode, CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface StarButtonBaseProps {
  children: ReactNode
  lightWidth?: number
  duration?: number
  lightColor?: string
  borderWidth?: number
  className?: string
}

type StarButtonProps =
  | (StarButtonBaseProps & { href: string; download?: boolean | string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof StarButtonBaseProps>)
  | (StarButtonBaseProps & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof StarButtonBaseProps>)

export function StarButton({
  children,
  lightWidth = 110,
  duration = 3,
  lightColor = '#78c287',
  borderWidth = 1,
  className,
  style: userStyle,
  ...props
}: StarButtonProps & { style?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) {
      const el = ref.current
      el.style.setProperty(
        '--path',
        `path('M 0 0 H ${el.offsetWidth} V ${el.offsetHeight} H 0 V 0')`,
      )
    }
  }, [])

  const sharedStyle = {
    '--duration': duration,
    '--light-width': `${lightWidth}px`,
    '--light-color': lightColor,
    '--border-width': `${borderWidth}px`,
    isolation: 'isolate',
    ...userStyle,
  } as CSSProperties

  const sharedClassName = cn(
    'relative z-[3] overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors group/star-button',
    className,
  )

  const inner = (
    <>
      {/* Orbiting glow along border path */}
      <div
        className="absolute aspect-square inset-0 animate-star-btn"
        style={{
          offsetPath: 'var(--path)',
          offsetDistance: '0%',
          width: 'var(--light-width)',
          background: 'radial-gradient(ellipse at center, var(--light-color), transparent, transparent)',
        } as CSSProperties}
      />
      {/* Subtle border overlay */}
      <div
        className="absolute inset-0 z-[4] rounded-[inherit]"
        style={{ borderWidth: 'var(--border-width)', borderStyle: 'solid', borderColor: 'rgba(120,194,135,0.25)' }}
        aria-hidden="true"
      />
      <span className="z-10 relative flex items-center gap-[6px]">
        {children}
      </span>
    </>
  )

  if ('href' in props && props.href !== undefined) {
    const { href, download, ...rest } = props as { href: string; download?: boolean | string } & React.AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        download={download}
        style={sharedStyle}
        className={sharedClassName}
        {...rest}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      style={sharedStyle}
      className={sharedClassName}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {inner}
    </button>
  )
}
