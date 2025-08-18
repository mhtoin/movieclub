import { getCurrentSession } from '@/lib/authentication/session'
import { getQueryClient } from '@/lib/getQueryClient'
import { getMovie } from '@/lib/movies/queries'
import prisma from '@/lib/prisma'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { redirect, notFound } from 'next/navigation'
import { Suspense } from 'react'
import MovieDetails from './MovieDetails'

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { user } = await getCurrentSession()
  const { id } = await params

  if (!user) {
    redirect('/')
  }

  // Get movie from database first
  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      user: true,
      reviews: {
        include: {
          user: true
        }
      }
    }
  })

  if (!movie) {
    notFound()
  }

  const queryClient = getQueryClient()

  // Prefetch TMDB data for the movie
  queryClient.prefetchQuery({
    queryKey: ['movie', movie.tmdbId],
    queryFn: () => getMovie(movie.tmdbId),
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <div className="container mx-auto px-4 py-8">
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<div>Loading...</div>}>
          <MovieDetails movie={movie} />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}