import CurrentMoviePoster from '@/components/home/CurrentMoviePoster'
import { getMostRecentMovieOfTheWeek } from '@/lib/movies/movies'

import { Suspense } from 'react'

export default async function HomePage() {
  const mostRecentMovie = await getMostRecentMovieOfTheWeek()

  return (
    <div className="bg-main-background relative h-screen snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <div className="min-h-screen shrink-0 snap-start">
        <Suspense fallback={null}>
          <div className="relative flex h-screen w-screen snap-start items-center justify-center overflow-x-hidden">
            <CurrentMoviePoster mostRecentMovie={mostRecentMovie} />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
