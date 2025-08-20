"use client"
import { Search } from "lucide-react"
import { Input } from "components/ui/Input"
import { useScrollProgress } from "@/hooks/useScrollProgress"
import { cn } from "@/lib/utils"

interface StickySearchBarProps {
  search: string
  setSearch: (search: string) => void
  className?: string
}

export default function StickySearchBar({
  search,
  setSearch,
  className,
}: StickySearchBarProps) {
  const { isScrolled, scrollProgress } = useScrollProgress({ threshold: 100 })

  return (
    <>
      {/* Static search bar (hidden when sticky is shown) */}
      <div
        className={cn(
          "relative max-w-md transition-opacity duration-300",
          isScrolled ? "opacity-0 pointer-events-none" : "opacity-100",
          className,
        )}
      >
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sticky search bar */}
      <div
        className={cn(
          "fixed top-20 left-0 right-0 z-50 transition-all duration-500 ease-out border",
          isScrolled
            ? "translate-y-0 opacity-100 shadow-lg backdrop-blur-md"
            : "-translate-y-full opacity-0",
        )}
        style={{
          background: `linear-gradient(135deg, 
            hsl(var(--background)/0.95) 0%, 
            hsl(var(--background)/0.98) 50%, 
            hsl(var(--background)/0.95) 100%)`,
          borderBottom: "1px solid hsl(var(--border)/0.5)",
        }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background/70 border-border/50 focus:border-primary/50 transition-all duration-200 focus:bg-background"
              />
            </div>

            {/* Enhanced Progress indicator */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Timeline Progress</span>
              <div className="relative w-24 h-2 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-300 ease-out rounded-full"
                  style={{
                    width: `${scrollProgress * 100}%`,
                    background: `linear-gradient(90deg, 
                      var(--sky), var(--teal) 15%, var(--green) 30%, 
                      var(--yellow) 45%, var(--peach) 60%, var(--maroon) 75%, 
                      var(--red) 90%, var(--mauve) 100%)`,
                    boxShadow: `0 0 8px rgba(var(--primary-rgb), 0.3)`,
                  }}
                />
                {/* Animated shimmer effect */}
                <div
                  className="absolute top-0 h-full w-8 opacity-30 rounded-full transition-all duration-1000"
                  style={{
                    left: `${Math.max(0, scrollProgress * 100 - 10)}%`,
                    background: `linear-gradient(90deg, 
                      transparent, 
                      rgba(255,255,255,0.4), 
                      transparent)`,
                  }}
                />
              </div>
              <span className="font-mono text-xs">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
