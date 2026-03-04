import { useState, useRef, useCallback, useEffect } from 'react'
import type { RefObject, CSSProperties } from 'react'

/** Measures which avatar items wrapped to a second (or later) row. */
export function useAvatarRow(triggerDep: unknown, dataAttr = 'key'): {
  containerRef: RefObject<HTMLDivElement | null>
  secondRow: Set<string>
} {
  const containerRef = useRef<HTMLDivElement>(null)
  const [secondRow, setSecondRow] = useState<Set<string>>(new Set())

  const measure = useCallback(() => {
    const el = containerRef.current
    if (!el || !el.children.length) return
    const firstTop = (el.children[0] as HTMLElement).getBoundingClientRect().top
    const next = new Set<string>()
    for (let i = 1; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement
      if (child.getBoundingClientRect().top > firstTop + 4)
        next.add(child.dataset[dataAttr] ?? '')
    }
    setSecondRow(next)
  }, [dataAttr])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerDep, measure])

  return { containerRef, secondRow }
}

/** Shared hover animation styles for overlapping avatar items. */
export function avatarHoverStyles(isHovered: boolean, isSecond: boolean): CSSProperties {
  return {
    transition: 'transform 150ms ease',
    transform: isHovered
      ? isSecond ? 'translateY(6px) scale(1.1)' : 'translateY(-6px) scale(1.1)'
      : 'translateY(0) scale(1)',
    filter: isHovered ? 'drop-shadow(0 4px 12px rgba(120,194,135,0.4))' : 'none',
  }
}
