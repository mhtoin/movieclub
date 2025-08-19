import { getMovieById } from "@/lib/movies/queries"
import { getMovieByIdWithReviews } from "@/lib/movies/movies"
import CurrentMoviePoster from "@/components/home/CurrentMoviePoster"
import { notFound } from "next/navigation"

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

    return (
      <div className="pt-[70px] min-h-screen">
        <div className="relative h-[calc(100vh-70px)]">
          <CurrentMoviePoster mostRecentMovie={movie} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching movie:", error)
    notFound()
  }
}

// For static generation, we need to generate params for movies with watchDate
export async function generateStaticParams() {
  try {
    // We'll use the database query to get all movies with watchDate
    const { getWatchedMovies } = await import("@/lib/movies/movies")
    const watchedMovies = await getWatchedMovies()
    
    return watchedMovies.map((movie) => ({
      id: movie.id,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}