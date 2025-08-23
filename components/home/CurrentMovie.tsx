"use client"
import { getMostRecentMovieOfTheWeek } from "@/lib/movies/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import MovieView from "./MovieView"

export default function CurrentMovie({ colors }: { colors: string[] }) {
  const { data: mostRecentMovie } = useSuspenseQuery({
    queryKey: ["movies", "mostRecent"],
    queryFn: getMostRecentMovieOfTheWeek,
  })

  return <MovieView movie={mostRecentMovie} colors={colors} />
}
