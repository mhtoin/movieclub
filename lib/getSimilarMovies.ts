import type { TMDBSimilarResponse } from "@/types/tmdb.type";

export async function getSimilarMovies(tmdbId: number) {
	const response = await fetch(
		`https://api.themoviedb.org/3/movie/${tmdbId}/similar`,
		{
			method: "GET",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
			},
		},
	);
	const data: TMDBSimilarResponse = await response.json();
	return data.results;
}
