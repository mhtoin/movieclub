import MovieCard from "@/components/search/MovieCard"
import { TabsContent } from "@/components/ui/Tabs"
import { useSearchQuery } from "@/lib/hooks"
import type { TMDBMovieResponse } from "@/types/tmdb.type"
import { Button } from "components/ui/Button"
import { ChevronUp, Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Fragment, useEffect, useRef } from "react"

export default function ResultTab() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    useSearchQuery()
  const searchParams = useSearchParams()
  const showOnlyAvailable = searchParams.get("showOnlyAvailable") === "true"
  const modalRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)
  const hasResults = data?.pages?.[0]?.total_results > 0
  const isInitialLoading = isFetching && !isFetchingNextPage && !data
  const noSearchPerformed = !data

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      },
      {
        root: modalRef.current,
        rootMargin: "1000px",
        threshold: 0.1,
      },
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  return (
    <TabsContent value="results" className="relative flex-1 justify-center">
      {resultsContainerRef.current && data?.pages?.[0]?.results?.length > 0 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 bottom-0 z-30"
          onClick={() => {
            resultsContainerRef.current?.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}
      <div
        ref={resultsContainerRef}
        className="relative flex max-h-[calc(90vh-150px)] w-full flex-wrap items-center justify-center gap-5 overflow-y-auto py-2"
      >
        {isInitialLoading && (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="mb-2 h-8 w-8 animate-spin">
              <Loader2 className="h-full w-full" />
            </div>
            <span className="text-muted-foreground text-center text-sm">
              Searching...
            </span>
          </div>
        )}

        {noSearchPerformed && !isInitialLoading && (
          <span className="text-muted-foreground text-center text-sm">
            No search performed yet
          </span>
        )}

        {data && data.pages[0].total_results === 0 && !isInitialLoading && (
          <span className="text-muted-foreground text-center text-sm">
            {showOnlyAvailable
              ? "No available movies found. Try unchecking 'Show only available'."
              : "No results found"}
          </span>
        )}

        {data?.pages?.map((page) => (
          <Fragment key={page.page}>
            {page?.results?.map((result: TMDBMovieResponse) => (
              <MovieCard key={result.id} movie={result} showActions />
            ))}
          </Fragment>
        ))}
        {hasResults && (
          <div className="flex h-10 w-full justify-center">
            <div ref={sentinelRef} className="h-1 w-full" />
            {isFetchingNextPage && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </TabsContent>
  )
}
