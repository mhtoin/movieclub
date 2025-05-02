export const revalidate = 0

import { CurrentMovieWrapper } from '@/components/home/CurrentMovieWrapper'
import { getCurrentSession } from '@/lib/authentication/session'
import { getQueryClient } from '@/lib/getQueryClient'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import MoviesOfTheMonth from 'components/home/MoviesOfTheMonth'
import { format } from 'date-fns'
import { getMoviesOfTheWeekByMonth } from 'lib/movies/movies'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default async function HomePage() {
  const queryClient = getQueryClient()

  queryClient.prefetchInfiniteQuery({
    queryKey: ['pastMovies'],
    queryFn: () => getMoviesOfTheWeekByMonth(format(new Date(), 'yyyy-MM')),
    initialPageParam: format(new Date(), 'yyyy-MM'),
  })

  const dehydratedState = dehydrate(queryClient)
  const { user } = await getCurrentSession()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="bg-main-background relative h-screen snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <div className="min-h-screen shrink-0 snap-start">
        <Suspense fallback={null}>
          <CurrentMovieWrapper />
        </Suspense>
      </div>
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={null}>
          <MoviesOfTheMonth />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}
