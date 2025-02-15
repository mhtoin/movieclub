import type { MovieWithUser } from "@/types/movie.type";
import type { Shortlist } from "@prisma/client";

export interface ShortlistWithMovies extends Shortlist {
	movies: MovieWithUser[];
}

export interface ShortlistWithMoviesById
	extends Record<string, ShortlistWithMovies> {}
