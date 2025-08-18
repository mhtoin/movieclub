import { getCurrentSession } from '@/lib/authentication/session'
import { getQueryClient } from '@/lib/getQueryClient'
import { getWatchedMovies } from '@/lib/movies/movies'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import HistoryContainer from './HistoryContainer'

export default async function HistoryPage() {
  const { user } = await getCurrentSession()

  if (!user) {
    redirect('/')
  }

  const queryClient = getQueryClient()

  // Prefetch watched movies for better performance
  queryClient.prefetchQuery({
    queryKey: ['watchedMovies', undefined],
    queryFn: async () => {
      const movies = await getWatchedMovies()
      return movies.sort((a, b) => {
        if (!a.watchDate) return 1
        if (!b.watchDate) return -1
        return b.watchDate.localeCompare(a.watchDate)
      })
    },
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Watch History</h1>
        <p className="text-muted-foreground mt-2">
          All movies watched by the movie club
        </p>
      </div>
      
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<div>Loading...</div>}>
          <HistoryContainer />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}