"use client"
import { ArrowUp } from "lucide-react"
import { useScrollProgress } from "@/hooks/useScrollProgress"
import { cn } from "@/lib/utils"

export default function ScrollIndicator() {
  const { scrollProgress, isScrolled } = useScrollProgress({ threshold: 300 })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2 transition-all duration-500",
        isScrolled ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
      )}
    >
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
          <path
            className="stroke-current text-muted opacity-25"
            strokeWidth="2"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="stroke-current text-primary"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${scrollProgress * 100}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            style={{
              filter: "drop-shadow(0 0 6px rgba(var(--primary-rgb), 0.4))",
            }}
          />
        </svg>

        <button
          onClick={scrollToTop}
          className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm border rounded-full hover:bg-background transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4 text-foreground" />
        </button>
      </div>

      <div className="text-xs text-muted-foreground font-mono bg-background/80 backdrop-blur-sm px-2 py-1 rounded border">
        {Math.round(scrollProgress * 100)}%
      </div>
    </div>
  )
}
