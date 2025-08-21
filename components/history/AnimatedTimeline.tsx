"use client"
import { useRef } from "react"
import { useElementInView } from "@/hooks/useScrollProgress"
import { cn } from "@/lib/utils"

interface AnimatedTimelineProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedTimelineNode({
  children,
  className,
}: AnimatedTimelineProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const { isInView, intersectionRatio } = useElementInView(
    nodeRef as React.RefObject<HTMLElement>,
    {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: "-10% 0px -10% 0px",
    },
  )

  const scale = 0.8 + intersectionRatio * 0.2 // Scale from 0.8 to 1.0
  const opacity = Math.max(0.3, intersectionRatio) // Opacity from 0.3 to 1.0

  return (
    <div
      ref={nodeRef}
      className={cn(
        "relative transition-all duration-700 ease-out",
        isInView ? "translate-x-0" : "translate-x-4",
        className,
      )}
      style={{
        transform: `scale(${scale}) translateX(${isInView ? 0 : 16}px)`,
        opacity,
      }}
    >
      <div className="relative z-10 bg-overlay0 text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold transition-all duration-500">
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-500",
            isInView ? "scale-100 opacity-20" : "scale-150 opacity-0",
          )}
        />
        <div className="relative z-10 ">{children}</div>
      </div>
    </div>
  )
}

export function AnimatedTimelineLine({
  scrollProgress,
  className,
}: {
  scrollProgress: number
  className?: string
}) {
  const parallaxOffset = scrollProgress * 20 // Subtle parallax effect

  return (
    <div
      className={cn(
        "absolute left-4 top-0 bottom-0 w-0.5 mt-5 overflow-hidden",
        className,
      )}
      style={{
        transform: `translateY(${parallaxOffset}px)`,
      }}
    >
      {/* Background line */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "linear-gradient(to bottom, var(--sky), var(--teal) 10%, var(--green) 20%, var(--yellow) 30%, var(--peach) 40%, var(--maroon) 50%, var(--red) 60%, var(--mauve) 70%, var(--pink) 80%, var(--flamingo) 90%, var(--rosewater) 100%)",
        }}
      />

      {/* Animated progress line */}
      <div
        className="absolute top-0 left-0 w-full transition-all duration-300 ease-out"
        style={{
          height: `${Math.min(scrollProgress * 95, 100)}%`, // Slight overshoot effect
          background:
            "linear-gradient(to bottom, var(--sky), var(--teal) 10%, var(--green) 20%, var(--yellow) 30%, var(--peach) 40%, var(--maroon) 50%, var(--red) 60%, var(--mauve) 70%, var(--pink) 80%, var(--flamingo) 90%, var(--rosewater) 100%)",
          filter: "drop-shadow(0 0 6px rgba(var(--primary-rgb), 0.4))",
        }}
      />

      {/* Pulsating nodes along the timeline */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse"
          style={{
            top: `${(i + 1) * 20}%`,
            left: "-3px",
            animationDelay: `${i * 0.2}s`,
            animationDuration: "2s",
          }}
        />
      ))}

      {/* Moving particle effect */}
      <div
        className="absolute w-1.5 h-1.5 bg-primary rounded-full transition-all duration-300"
        style={{
          top: `${Math.min(scrollProgress * 100, 95)}%`,
          left: "-2px",
          boxShadow: "0 0 12px 3px rgba(var(--primary-rgb), 0.6)",
          opacity: scrollProgress > 0 ? 1 : 0,
        }}
      />

      {/* Trail effect behind the particle */}
      <div
        className="absolute w-0.5 rounded-full transition-all duration-500"
        style={{
          top: `${Math.max(0, scrollProgress * 100 - 10)}%`,
          left: "0px",
          height: "10%",
          background: `linear-gradient(to bottom, 
            transparent, 
            rgba(var(--primary-rgb), 0.8), 
            transparent)`,
          opacity: scrollProgress > 0.1 ? 0.6 : 0,
        }}
      />
    </div>
  )
}
