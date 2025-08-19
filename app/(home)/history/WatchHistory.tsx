"use client"
import { getWatchHistory } from "@/lib/movies/queries"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { Loader2Icon, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Input } from "components/ui/Input"
import WatchHistoryItem from "./WatchHistoryItem"
import { useDebouncedValue } from "@/lib/hooks"
import { format } from "date-fns"

export default function WatchHistory() {
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebouncedValue(search, 300)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useSuspenseInfiniteQuery({
      queryKey: ["watchHistory", debouncedSearch],
      queryFn: ({ pageParam }) => getWatchHistory(pageParam, debouncedSearch),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextMonth : undefined
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
    })

  // Refetch when search changes
  useEffect(() => {
    refetch()
  }, [debouncedSearch, refetch])

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        rootMargin: "100px",
        threshold: 0,
      },
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage, isFetchingNextPage])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        {data?.pages.map((page, pageIndex) => (
          <div key={pageIndex} className="space-y-8">
            {page.movies.length > 0 && (
              <div className="relative">
                <div className="flex items-center gap-4 my-6">
                  <div className="relative z-10 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                    {pageIndex + 1}
                  </div>
                  <div className="bg-background border rounded-lg px-4 py-2">
                    <h2 className="text-lg font-semibold">
                      {format(new Date(page.month + "-01"), "MMMM yyyy")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {page.movies.length} movie
                      {page.movies.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="ml-12 space-y-4">
                  {page.movies.map((movie) => (
                    <WatchHistoryItem key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2Icon className="h-6 w-6 animate-spin" />
          </div>
        )}

        <div ref={sentinelRef} className="h-4" />

        {!hasNextPage && data?.pages[0]?.movies.length > 0 && (
          <div className="flex justify-center py-8">
            <div className="text-sm text-muted-foreground">
              That&apos;s all the history we have!
            </div>
          </div>
        )}

        {data?.pages[0]?.movies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {search
                ? "No movies found matching your search."
                : "No watch history yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
