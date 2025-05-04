'use client'

import type { MovieWithUser } from '@/types/movie.type'
import type { Movie } from '@prisma/client'
import { Button } from 'components/ui/Button'
import {
  useAddToWatchlistMutation,
  useRemoveFromShortlistMutation,
  useUpdateSelectionMutation,
  useUpdateShortlistMutation,
  useValidateSession,
} from 'lib/hooks'
import {
  BookmarkMinus,
  BookmarkPlus,
  Plus,
  Star,
  TicketCheck,
  TicketPlus,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FaImdb } from 'react-icons/fa'
import { SiThemoviedatabase } from 'react-icons/si'

interface SearchResultCardProps {
  movie: MovieWithUser | Movie
  shortlistId: string
  removeFromShortList?: boolean
  highlight?: boolean
  requiresSelection?: boolean
  index?: number
  showActions?: boolean
  isInWatchlist?: boolean
}

export default function ShortListItem({
  movie,
  shortlistId,
  removeFromShortList,
  highlight,
  requiresSelection,
  index,
  showActions,
  isInWatchlist,
}: SearchResultCardProps) {
  const removeMutation = useRemoveFromShortlistMutation()
  const selectionMutation = useUpdateSelectionMutation()
  const watchlistMutation = useAddToWatchlistMutation()
  const addMutation = useUpdateShortlistMutation()
  const { data: user } = useValidateSession()

  return (
    <div
      className={`moviecard group rounded-none md:rounded-md ${
        highlight ? 'highlight' : ''
      }`}
    >
      {showActions &&
        requiresSelection &&
        shortlistId === user?.shortlistId && (
          <div className="fill-accent stroke-foreground bg-card absolute top-0 left-0 z-10 flex -translate-x-20 flex-col items-center justify-center gap-2 rounded-tl-md rounded-br-lg p-2 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-80">
            <Button
              variant={'ghost'}
              size={'iconSm'}
              tooltip={highlight ? 'Selected' : 'Select'}
              onClick={() => {
                selectionMutation.mutate({
                  userId: user?.id || '',
                  shortlistId: user?.shortlistId || '',
                  selectedIndex: index || 0,
                })
              }}
              isLoading={selectionMutation.isPending}
            >
              {highlight ? (
                <TicketCheck className="text-primary h-5 w-5" />
              ) : (
                <TicketPlus className="text-primary h-5 w-5" />
              )}
            </Button>
          </div>
        )}
      {showActions && (
        <div className="border-border/50 fill-accent stroke-foreground bg-card absolute top-0 right-0 z-10 flex translate-x-20 flex-col items-center justify-center gap-2 rounded-tr-none rounded-bl-lg border p-2 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-80 md:rounded-tr-md">
          {removeFromShortList ? (
            <Button
              variant={'ghost'}
              size={'iconXs'}
              tooltip="Remove"
              onClick={() => {
                removeMutation.mutate({
                  userId: user?.id || '',
                  shortlistId: user?.shortlistId || '',
                  movieId: movie.id || '',
                })
              }}
              isLoading={removeMutation.isPending}
            >
              <X className="text-primary h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant={'ghost'}
              size={'iconXs'}
              tooltip="Add"
              onClick={() => {
                addMutation.mutate({
                  movie: movie,
                  shortlistId: user?.shortlistId || '',
                })
              }}
              isLoading={addMutation.isPending}
            >
              <Plus className="text-primary h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="iconXs"
            onClick={() => {
              watchlistMutation.mutate({
                movieId: movie.tmdbId,
              })
            }}
            isLoading={watchlistMutation.isPending}
            tooltip={
              isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'
            }
          >
            {isInWatchlist ? (
              <BookmarkMinus className="text-primary h-5 w-5" />
            ) : (
              <BookmarkPlus className="text-primary h-5 w-5" />
            )}
          </Button>
        </div>
      )}
      <Image
        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
        alt=""
        width={'150'}
        height={'150'}
        className={
          'primary-img h-auto w-[150px] rounded-none! md:rounded-md 2xl:w-[150px]'
        }
        priority={removeFromShortList}
        loading={removeFromShortList ? 'eager' : 'lazy'}
      />
      {(selectionMutation.isPending || removeMutation.isPending) && (
        <span className="loading loading-spinner loading-lg absolute top-0 right-0 bottom-0 left-0 z-40 m-auto" />
      )}
      <div className="info">
        <h1 className="title line-clamp-2">{movie.title}</h1>
        <div className="overview flex flex-row flex-wrap gap-2">
          <span className="flex flex-row items-center gap-1 text-xs">
            <Star className="h-4 w-4" />
            {movie.vote_average.toFixed(1)}
          </span>
          <span className="flex flex-row items-center gap-1 text-xs">
            <Users className="h-4 w-4" />
            {movie.vote_count}
          </span>
          <span className="flex flex-row items-center gap-1 text-xs">
            <TrendingUp className="h-4 w-4" />
            {movie.popularity.toFixed(1)}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div className="flex flex-row gap-2" />
          <div className="description-links">
            <div className="flex flex-row items-center gap-2">
              <Link
                href={`https://www.themoviedb.org/movie/${movie?.tmdbId}`}
                target="_blank"
              >
                <Button variant="ghost" size="icon">
                  <SiThemoviedatabase className="h-6 w-6" />
                </Button>
              </Link>
              <Link
                href={`https://www.imdb.com/title/${movie?.imdbId}`}
                target="_blank"
              >
                <Button variant="ghost" size="icon">
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
