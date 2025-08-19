"use client"
import { getWatchHistory } from "@/lib/movies/queries"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { useEffect, useRef } from "react"

import WatchHistoryItem from "./WatchHistoryItem"
import { format } from "date-fns"

interface WatchHistoryItemsProps {
  search: string
}

export default function WatchHistoryItems({ search }: WatchHistoryItemsProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const prefetchSentinelRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["watchHistory", search],
      queryFn: ({ pageParam }) => getWatchHistory(pageParam, search),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => {
        // For search results, use the cursor-based pagination
        if (search.trim() && lastPage.month === "search-results") {
          return lastPage.hasMore ? lastPage.nextMonth : undefined
        }
        // For month-based browsing, use the original logic
        return lastPage.hasMore ? lastPage.nextMonth : undefined
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
    })

  // Early prefetch when user scrolls into the middle of the content
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        rootMargin: "500px", // Prefetch much earlier - when 500px away
        threshold: 0,
      },
    )

    if (prefetchSentinelRef.current) {
      observer.observe(prefetchSentinelRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage, isFetchingNextPage])

  // Backup intersection observer for infinite scroll (closer to the end)
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
    <div className="relative">
      {!search.trim() && (
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5 mt-5"
          style={{
            background:
              "linear-gradient(to bottom, var(--sky), var(--teal) 10%, var(--green) 20%, var(--yellow) 30%, var(--peach) 40%, var(--maroon) 50%, var(--red) 60%, var(--mauve) 70%, var(--pink) 80%, var(--flamingo) 90%, var(--rosewater) 100%)",
          }}
        />
      )}

      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="space-y-8">
          {page.movies.length > 0 && (
            <div className="relative">
              {/* Show month headers only for non-search results */}
              {!search.trim() && page.month !== "search-results" && (
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
              )}
              <div className={search.trim() ? "space-y-4" : "ml-12 space-y-4"}>
                {page.movies.map((movie, index) => (
                  <div key={movie.id}>
                    <WatchHistoryItem movie={movie} />
                    {index === Math.floor(page.movies.length / 2) &&
                      pageIndex === data.pages.length - 1 && (
                        <div ref={prefetchSentinelRef} className="h-0 w-0" />
                      )}
                  </div>
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
            {search.trim()
              ? `No movies found matching &ldquo;${search}&rdquo;.`
              : "No watch history yet."}
          </p>
        </div>
      )}
    </div>
  )
}
