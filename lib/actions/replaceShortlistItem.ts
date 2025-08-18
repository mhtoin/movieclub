"use server"

import type { MovieWithUser } from "@/types/movie.type"
import type { TMDBMovieResponse } from "@/types/tmdb.type"
import type { Movie } from "@prisma/client"
import { replaceShortlistMovie } from "lib/shortlist"

export async function replaceShortlistItem(
  replacedMovie: MovieWithUser | Movie,
  replacingWithMovie: MovieWithUser | TMDBMovieResponse | Movie,
  shortlistId: string,
) {
  return await replaceShortlistMovie(
    replacedMovie,
    replacingWithMovie,
    shortlistId,
  )
}
