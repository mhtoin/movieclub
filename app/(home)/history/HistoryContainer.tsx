'use client'

import { useWatchedMoviesQuery } from '@/lib/hooks'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Search, ChevronUp } from 'lucide-react'
import HistoryList from './HistoryList'

// Custom hook for debounced value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function HistoryContainer() {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearchTerm = useDebounce(searchInput, 300) // 300ms debounce
  
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useWatchedMoviesQuery(debouncedSearchTerm)
  
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)

  // Auto-load more when scrolling near the bottom
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            fetchNextPage()
          }
        }
      },
      { root: null, rootMargin: "10px", threshold: 0.1 }
    )

    const el = loadMoreButtonRef.current
    if (el) {
      observer.observe(el)
    }

    return () => {
      if (el) {
        observer.unobserve(el)
      }
    }
  }, [hasNextPage, fetchNextPage, isFetchingNextPage])

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading watch history</p>
      </div>
    )
  }

  const allMovies = data?.pages.flatMap(page => page.movies) || []
  const totalResults = data?.pages[0]?.total || 0

  return (
    <div className="space-y-6">
      {/* Header with search and scroll to top */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search movies..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={() => {
            resultsContainerRef.current?.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>

      {/* Results info */}
      {totalResults > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {totalResults} movie{totalResults !== 1 ? 's' : ''} found
            {data?.pages && data.pages.length > 0 && (
              <span className="ml-2">
                (showing {allMovies.length} of {totalResults})
              </span>
            )}
          </p>
        </div>
      )}

      {/* Scrollable container */}
      <div ref={resultsContainerRef} className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Movies List */}
        {!isLoading && allMovies.length > 0 && (
          <HistoryList movies={allMovies} />
        )}

        {/* Load More Button (hidden but used for intersection observer) */}
        {hasNextPage && (
          <Button
            variant="outline"
            size="lg"
            className="mx-auto h-[1px] min-h-[1px] max-w-sm opacity-0"
            ref={loadMoreButtonRef}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        )}

        {/* Loading more indicator */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Loading more movies...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {debouncedSearchTerm ? 'No movies found matching your search.' : 'No movies watched yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}