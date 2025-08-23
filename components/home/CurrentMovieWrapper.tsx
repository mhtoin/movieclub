import MovieView from "@/components/home/MovieView"
import { getMostRecentMovieOfTheWeek } from "@/lib/movies/movies"

export async function CurrentMovieWrapper() {
  const mostRecentMovie = await getMostRecentMovieOfTheWeek()
  return (
    <div className="relative flex h-screen w-screen snap-start items-center justify-center overflow-x-hidden">
      <MovieView mostRecentMovie={mostRecentMovie} />
    </div>
  )
}
