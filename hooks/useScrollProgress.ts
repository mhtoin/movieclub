"use client"
import { useEffect, useState } from "react"

interface UseScrollProgressOptions {
  threshold?: number
  element?: HTMLElement | null
}

export function useScrollProgress({
  threshold = 0,
  element,
}: UseScrollProgressOptions = {}) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const targetElement = element || document.documentElement

    const handleScroll = () => {
      const scrollTop = targetElement.scrollTop || window.pageYOffset
      const scrollHeight =
        targetElement.scrollHeight || document.documentElement.scrollHeight
      const clientHeight = targetElement.clientHeight || window.innerHeight

      const maxScroll = scrollHeight - clientHeight
      const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0

      setScrollProgress(progress)
      setIsScrolled(scrollTop > threshold)
    }

    const scrollElement = element || window
    scrollElement.addEventListener("scroll", handleScroll, { passive: true })

    // Initial calculation
    handleScroll()

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [threshold, element])

  return { scrollProgress, isScrolled }
}

export function useElementInView(
  elementRef: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {},
) {
  const [isInView, setIsInView] = useState(false)
  const [intersectionRatio, setIntersectionRatio] = useState(0)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        setIntersectionRatio(entry.intersectionRatio)
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        ...options,
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, options])

  return { isInView, intersectionRatio }
}
