import { getMovieByIdWithReviews, getWatchedMovies } from "@/lib/movies/movies"
import CurrentMoviePoster from "@/components/home/CurrentMoviePoster"
import { colors } from "@/components/home/ColorMap"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params

  try {
    const movie = await getMovieByIdWithReviews(id)

    if (!movie || !movie.watchDate) {
      notFound()
    }

    const colorClasses = Array.from(
      { length: movie.genres.length + 2 },
      () => colors[Math.floor(Math.random() * colors.length)],
    )

    return (
      <div className="bg-main-background relative h-screen snap-y snap-mandatory overflow-y-auto scroll-smooth">
        <div className="min-h-screen shrink-0 snap-start">
          <Suspense fallback={null}>
            <div className="relative flex h-screen w-screen snap-start items-center justify-center overflow-x-hidden">
              <CurrentMoviePoster
                mostRecentMovie={movie}
                colors={colorClasses}
              />
            </div>
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching movie:", error)
    notFound()
  }
}

export async function generateStaticParams() {
  try {
    const watchedMovies = await getWatchedMovies()

    return watchedMovies.map((movie) => ({
      id: movie.id,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}
