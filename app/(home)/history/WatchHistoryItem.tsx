import type { MovieWithReviews } from "@/types/movie.type"
import { Calendar, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

interface Review {
  rating: number
}

export default function WatchHistoryItem({ movie }: { movie: MovieWithReviews }) {
  const posterUrl = movie?.images?.posters?.[0]?.file_path
    ? `https://image.tmdb.org/t/p/w342${movie.images.posters[0].file_path}`
    : movie?.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "/placeholder-movie.jpg"

  const watchDate = movie.watchDate ? new Date(movie.watchDate) : null
  const averageRating = movie.reviews.length > 0 
    ? movie.reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / movie.reviews.length 
    : null

  return (
    <div className="group relative bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex gap-4">
        {/* Movie Poster */}
        <div className="flex-shrink-0">
          <Image
            src={posterUrl}
            alt={movie.title}
            width={80}
            height={120}
            className="rounded-md object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>

        {/* Movie Details */}
        <div className="flex-grow min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                {movie.title}
              </h3>
              
              {/* Watch Date */}
              {watchDate && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  <span>{format(watchDate, "MMMM d, yyyy")}</span>
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <p className="text-sm text-muted-foreground mb-2 overflow-hidden text-ellipsis" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {movie.overview}
                </p>
              )}

              {/* Rating */}
              {averageRating !== null && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({movie.reviews.length} review{movie.reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
              )}
            </div>

            {/* User Avatar and Name */}
            {movie.user && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Image
                  src={movie.user.image || "/default-avatar.jpg"}
                  alt={movie.user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="text-sm">
                  <p className="font-medium">{movie.user.name}</p>
                  <p className="text-muted-foreground">Chosen by</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Link overlay for the entire card */}
      <Link 
        href={`/home?month=${movie.watchDate?.substring(0, 7)}&date=${movie.watchDate?.split("-")[2]}`}
        className="absolute inset-0 z-10"
        aria-label={`View details for ${movie.title}`}
      />
    </div>
  )
}