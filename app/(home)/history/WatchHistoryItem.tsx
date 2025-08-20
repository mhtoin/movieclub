import type { MovieWithReviews } from "@/types/movie.type"
import { Calendar, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { useRef } from "react"
import Avatar from "@/components/ui/Avatar"
import { useElementInView } from "@/hooks/useScrollProgress"

interface Review {
  rating: number
}

export default function WatchHistoryItem({
  movie,
}: {
  movie: MovieWithReviews
}) {
  const itemRef = useRef<HTMLDivElement>(null)
  const { isInView, intersectionRatio } = useElementInView(
    itemRef as React.RefObject<HTMLElement>,
    {
      threshold: [0, 0.1, 0.5, 1],
      rootMargin: "-20px 0px -20px 0px",
    },
  )
  const posterUrl = movie?.images?.posters?.[0]?.file_path
    ? `https://image.tmdb.org/t/p/w342${movie.images.posters[0].file_path}`
    : movie?.poster_path
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : "/placeholder-movie.jpg"

  const watchDate = movie.watchDate ? new Date(movie.watchDate) : null
  const averageRating =
    movie.reviews.length > 0
      ? movie.reviews.reduce(
          (sum: number, review: Review) => sum + review.rating,
          0,
        ) / movie.reviews.length
      : null

  const opacity = Math.max(0.3, intersectionRatio)
  const translateY = isInView ? 0 : 20
  const scale = 0.95 + intersectionRatio * 0.05

  return (
    <div
      ref={itemRef}
      className="group relative bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-500 ease-out hover:translate-x-0.2"
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div className="flex gap-4">
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
        <div className="flex-grow min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                {movie.title}
              </h3>
              {watchDate && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  <span>{format(watchDate, "MMMM d, yyyy")}</span>
                </div>
              )}
              {movie.overview && (
                <p
                  className="text-sm text-muted-foreground mb-2 overflow-hidden text-ellipsis"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {movie.overview}
                </p>
              )}
              {averageRating !== null && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="font-medium">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({movie.reviews.length} review
                    {movie.reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
              )}
            </div>
            {movie.user && (
              <div className="flex items-center justify-center gap-2 flex-shrink-0">
                <Avatar
                  src={movie.user.image}
                  alt={`${movie.user.name}'s avatar`}
                  name={movie.user.name}
                  size={32}
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
      <Link
        href={`/movie/${movie.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View details for ${movie.title}`}
      />
    </div>
  )
}
