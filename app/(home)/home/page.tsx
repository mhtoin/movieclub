import { colors } from "@/components/home/ColorMap"
import CurrentMovie from "@/components/home/CurrentMovie"
import { getQueryClient } from "@/lib/getQueryClient"
import { getMostRecentMovieOfTheWeek } from "@/lib/movies/movies"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { Suspense } from "react"

export default async function HomePage() {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ["movies", "mostRecent"],
    queryFn: getMostRecentMovieOfTheWeek,
  })
  //const mostRecentMovie = await getMostRecentMovieOfTheWeek()
  const colorClasses = Array.from(
    { length: 10 },
    () => colors[Math.floor(Math.random() * colors.length)],
  )

  return (
    <div className="bg-main-background relative h-screen snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <div className="min-h-screen shrink-0 snap-start">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={null}>
            <div className="relative flex h-screen w-screen snap-start items-center justify-center overflow-x-hidden">
              <CurrentMovie colors={colorClasses} />
            </div>
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  )
}
