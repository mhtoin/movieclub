"use client"
import { getMovieById } from "@/lib/movies/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import MovieView from "../home/MovieView"

export default function Movie({
  colors,
  id,
}: {
  colors: string[]
  id: string
}) {
  const { data: movie } = useSuspenseQuery({
    queryKey: ["movies", "mostRecent"],
    queryFn: () => getMovieById(id),
  })

  return (
    <div className="relative flex h-screen w-screen snap-start items-center justify-center overflow-x-hidden">
      <MovieView movie={movie} colors={colors} />
    </div>
  )
}
