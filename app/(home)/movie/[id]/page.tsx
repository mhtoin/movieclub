import { getMovieByIdWithReviews, getWatchedMovies } from "@/lib/movies/movies"
import { colors } from "@/components/home/ColorMap"
import { Suspense } from "react"
import { getQueryClient } from "@/lib/getQueryClient"
import Movie from "@/components/movie/Movie"

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params

  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ["movies", id],
    queryFn: () => getMovieByIdWithReviews(id),
  })

  const colorClasses = Array.from(
    { length: 10 },
    () => colors[Math.floor(Math.random() * colors.length)],
  )

  return (
    <div className="bg-main-background relative h-screen snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <div className="min-h-screen shrink-0 snap-start">
        <Suspense fallback={null}>
          <div className="relative flex h-screen w-screen snap-start items-center justify-center overflow-x-hidden">
            <Movie colors={colorClasses} id={id} />
          </div>
        </Suspense>
      </div>
    </div>
  )
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
