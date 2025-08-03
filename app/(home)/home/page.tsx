import { colors } from "@/components/home/ColorMap"
import CurrentMoviePoster from "@/components/home/CurrentMoviePoster"
import { getMostRecentMovieOfTheWeek } from "@/lib/movies/movies"

import { Suspense } from "react"

export default async function HomePage() {
  const mostRecentMovie = await getMostRecentMovieOfTheWeek()
  const colorClasses = Array.from(
    { length: mostRecentMovie.genres.length + 1 },
    (_, i) => colors[Math.floor(Math.random() * colors.length)],
  )

  console.log("colorClasses", colorClasses)

  return (
    <div className="bg-main-background relative h-screen snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <div className="min-h-screen shrink-0 snap-start">
        <Suspense fallback={null}>
          <div className="relative flex h-screen w-screen snap-start items-center justify-center overflow-x-hidden">
            <CurrentMoviePoster
              mostRecentMovie={mostRecentMovie}
              colors={colorClasses}
            />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
