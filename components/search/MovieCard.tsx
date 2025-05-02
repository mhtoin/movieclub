'use client'

import {
  useAddToShortlistMutation,
  useAddToWatchlistMutation,
  useMovieQuery,
  useRemoveFromShortlistMutation,
  useValidateSession,
} from '@/lib/hooks'
import { getMovie } from '@/lib/movies/queries'
import type { TMDBMovieResponse } from '@/types/tmdb.type'
import { useQueryClient } from '@tanstack/react-query'
import {
  BookmarkMinus,
  BookmarkPlus,
  ListCheck,
  ListPlus,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { FaImdb } from 'react-icons/fa'
import { SiThemoviedatabase } from 'react-icons/si'
import { Button } from '../ui/Button'

export default function MovieCard({
  movie,
  added,
  inWatchlist,
  showActions,
}: {
  movie: TMDBMovieResponse
  added?: boolean
  inWatchlist?: boolean
  showActions?: boolean
}) {
  const queryClient = useQueryClient()
  const [isHovering, setIsHovering] = useState(false)
  const watchlistMutation = useAddToWatchlistMutation()
  const addMutation = useAddToShortlistMutation()
  const removeMutation = useRemoveFromShortlistMutation()
  const { data: movieData, status } = useMovieQuery(movie?.id, isHovering)
  const { data: user } = useValidateSession()

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['movie', movie.id],
      queryFn: () => getMovie(movie.id),
      staleTime: 1000 * 60 * 60 * 24,
      gcTime: 1000 * 60 * 60 * 24,
    })
  }

  return (
    <div
      className={'moviecard group'}
      onMouseEnter={() => {
        prefetch()
        setIsHovering(true)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
      }}
    >
      {showActions && (
        <div className="border-border/50 fill-accent stroke-foreground bg-card absolute top-0 right-0 z-10 flex flex-col items-center justify-center gap-2 rounded-tr-lg rounded-bl-lg border p-2 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-80">
          {added ? (
            <Button
              variant={'ghost'}
              size={'iconXs'}
              onClick={() => {
                removeMutation.mutate({
                  userId: user?.id ?? '',
                  shortlistId: user?.shortlistId ?? '',
                  movieId: movie.id,
                })
              }}
              isLoading={addMutation.isPending}
            >
              <ListCheck />
            </Button>
          ) : (
            <Button
              variant={'ghost'}
              size={'iconXs'}
              onClick={() => {
                if (movieData) {
                  addMutation.mutate({
                    userId: user?.id ?? '',
                    shortlistId: user?.shortlistId ?? '',
                    movie: movieData,
                  })
                }
              }}
              isLoading={addMutation.isPending}
            >
              <ListPlus />
            </Button>
          )}
          <Button
            variant="ghost"
            size="iconXs"
            onClick={() => {
              watchlistMutation.mutate({
                movieId: movie.id,
              })
            }}
            isLoading={watchlistMutation.isPending}
          >
            {inWatchlist ? <BookmarkMinus /> : <BookmarkPlus />}
          </Button>
        </div>
      )}

      <img
        src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
        alt=""
        width={250}
        height={375}
        className="absolute top-0 left-0 h-full w-full object-cover"
      />
      <div className="info">
        <h1 className="title line-clamp-2">{movie?.title}</h1>
        <div className="flex flex-row flex-wrap gap-2">
          <span className="flex flex-row items-center gap-1 text-xs">
            <Star className="h-4 w-4" />
            {movie?.vote_average?.toFixed(1)}
          </span>
          <span className="flex flex-row items-center gap-1 text-xs">
            <Users className="h-4 w-4" />
            {movie?.vote_count}
          </span>
          <span className="flex flex-row items-center gap-1 text-xs">
            <TrendingUp className="h-4 w-4" />
            {movie?.popularity?.toFixed(1)}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div className="flex flex-row gap-2" />
          <div className="description-links">
            <div className="flex flex-row items-center gap-2">
              <Link
                href={`https://www.themoviedb.org/movie/${movie?.id}`}
                target="_blank"
              >
                <Button variant="ghost" size="icon">
                  <SiThemoviedatabase className="h-6 w-6" />
                </Button>
              </Link>
              <Link
                href={`https://www.imdb.com/title/${movieData?.imdb_id}`}
                target="_blank"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  isLoading={status === 'pending'}
                >
                  <FaImdb className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
