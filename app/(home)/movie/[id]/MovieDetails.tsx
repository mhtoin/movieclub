'use client'

import type { MovieWithUser } from '@/types/movie.type'
import type { User, Review } from '@prisma/client'
import { useMovieQuery } from '@/lib/hooks'
import Image from 'next/image'
import { format } from 'date-fns'
import { Calendar, Star, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface MovieDetailsProps {
  movie: MovieWithUser & {
    reviews: (Review & { user: User })[]
  }
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  const { data: tmdbMovie } = useMovieQuery(movie.tmdbId, true)

  // Get poster image
  const movieImages = movie.images as { posters?: { file_path: string; blurDataUrl?: string }[] } | null
  const posterImage = movieImages?.posters?.[0]?.file_path
    ? `https://image.tmdb.org/t/p/w780${movieImages.posters[0].file_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : '/placeholder-movie.jpg'

  const blurDataUrl = movieImages?.posters?.[0]?.blurDataUrl

  // Get backdrop image
  const backdropImages = movie.images as { backdrops?: { file_path: string; blurDataUrl?: string }[] } | null
  const backdropImage = backdropImages?.backdrops?.[0]?.file_path
    ? `https://image.tmdb.org/t/p/original${backdropImages.backdrops[0].file_path}`
    : movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null

  const watchDate = movie.watchDate ? new Date(movie.watchDate) : null
  const releaseYear = new Date(movie.release_date).getFullYear()

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Button variant="outline" asChild>
          <Link href="/history">← Back to History</Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-lg overflow-hidden">
        {backdropImage && (
          <div className="absolute inset-0">
            <Image
              src={backdropImage}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          </div>
        )}
        
        <div className="relative z-10 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 items-start">
            {/* Poster */}
            <div className="mx-auto md:mx-0">
              <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src={posterImage}
                  alt={movie.title}
                  fill
                  sizes="300px"
                  className="object-cover"
                  placeholder={blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={blurDataUrl || ''}
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="space-y-6 text-center md:text-left">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
                {movie.tagline && (
                  <p className="text-xl text-muted-foreground italic">{movie.tagline}</p>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{releaseYear}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{movie.runtime}m</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{movie.vote_average.toFixed(1)}/10</span>
                </div>
              </div>

              {/* Watch Info */}
              {movie.user && watchDate && (
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <img
                      src={movie.user.image || '/default-avatar.jpg'}
                      alt={movie.user.name || 'User'}
                      className="h-8 w-8 rounded-full border"
                    />
                    <span className="font-medium">{movie.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Watched {format(watchDate, 'MMMM d, yyyy')}</span>
                  </div>
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
                </div>
              )}

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {movie.reviews && movie.reviews.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h2 className="text-2xl font-bold">Reviews ({movie.reviews.length})</h2>
          </div>
          
          <div className="grid gap-4">
            {movie.reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={review.user.image || '/default-avatar.jpg'}
                      alt={review.user.name || 'User'}
                      className="h-8 w-8 rounded-full border"
                    />
                    <span className="font-medium">{review.user.name}</span>
                  </div>
                  {review.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{review.rating}/10</span>
                    </div>
                  )}
                </div>
                {review.content && (
                  <p className="text-muted-foreground">{review.content}</p>
                )}
                <div className="text-xs text-muted-foreground">
                  {format(new Date(review.timestamp), 'MMM d, yyyy at h:mm a')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}