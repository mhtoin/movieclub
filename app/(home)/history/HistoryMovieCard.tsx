'use client'

import type { MovieWithUser } from '@/types/movie.type'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, Star } from 'lucide-react'

interface HistoryMovieCardProps {
  movie: MovieWithUser
}

export default function HistoryMovieCard({ movie }: HistoryMovieCardProps) {
  // Get poster image from images.posters or fallback to poster_path
  const movieImages = movie.images as { posters?: { file_path: string; blurDataUrl?: string }[] } | null
  const posterImage = movieImages?.posters?.[0]?.file_path
    ? `https://image.tmdb.org/t/p/w500${movieImages.posters[0].file_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg'

  const blurDataUrl = movieImages?.posters?.[0]?.blurDataUrl

  const watchDate = movie.watchDate ? new Date(movie.watchDate) : null

  return (
    <Link href={`/movie/${movie.id}`} className="block">
      <div className="group space-y-3 cursor-pointer transition-transform hover:scale-[1.02]">
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
        <Image
          src={posterImage}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform group-hover:scale-105"
          placeholder={blurDataUrl ? 'blur' : 'empty'}
          blurDataURL={blurDataUrl || ''}
        />
        
        {/* User Avatar Overlay */}
        {movie.user && (
          <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
            <img
              src={movie.user.image || '/default-avatar.jpg'}
              alt={movie.user.name || 'User'}
              className="h-6 w-6 rounded-full border border-white/20"
            />
            <span className="text-white text-xs font-medium">
              {movie.user.name}
            </span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-white text-xs font-medium">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        
        {watchDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Watched {format(watchDate, 'MMM d, yyyy')}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{new Date(movie.release_date).getFullYear()}</span>
          <span>{movie.runtime ? `${movie.runtime}m` : ''}</span>
        </div>
      </div>
    </Link>
  )
}