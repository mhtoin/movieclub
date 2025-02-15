import { omit } from "@/lib/utils";
import type { TMDBMovieResponse } from "@/types/tmdb.type";
import type { Prisma } from "@prisma/client";

export const createDbMovie = (
	movieData: TMDBMovieResponse,
): Prisma.MovieCreateInput => {
	return {
		...omit(movieData, ["id"]),
		tmdbId: movieData.id,
		imdbId: movieData?.imdb_id,
		runtime: movieData?.runtime,
		genres: movieData?.genres,
		tagline: movieData?.tagline,
		cast: movieData?.credits?.cast,
		videos: movieData?.videos,
	} as Prisma.MovieCreateInput;
};
