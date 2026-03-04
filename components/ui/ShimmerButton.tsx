import type { CSSProperties, ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

type BaseProps = {
  children: ReactNode
  shimmerColor?: string
  speed?: string
  background?: string
  borderRadius?: string
  style?: CSSProperties
  className?: string
}

type AsAnchor = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' }
type AsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' }

type ShimmerButtonProps = AsAnchor | AsButton

const innerNodes = (
  <>
    <div className="shimmer-btn__track">
      <div className="shimmer-btn__slide">
        <div className="shimmer-btn__conic" />
      </div>
    </div>
    <div className="shimmer-btn__glow" />
    <div className="shimmer-btn__fill" />
  </>
)

export function ShimmerButton({ children, shimmerColor, speed, background, borderRadius, style, className, as, ...rest }: ShimmerButtonProps) {
  const cssVars: CSSProperties = {
    ...(shimmerColor && { '--shimmer-color': shimmerColor } as CSSProperties),
    ...(speed        && { '--speed': speed }               as CSSProperties),
    ...(background   && { '--bg': background }             as CSSProperties),
    ...(borderRadius && { borderRadius }                   as CSSProperties),
    ...style,
  }

  const sharedProps = {
    className: `shimmer-btn${className ? ` ${className}` : ''}`,
    style: cssVars,
  }

  if (as === 'a') {
    return (
      <a {...sharedProps} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {innerNodes}
        {children}
      </a>
    )
  }

  return (
    <button {...sharedProps} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {innerNodes}
      {children}
    </button>
  )
}
