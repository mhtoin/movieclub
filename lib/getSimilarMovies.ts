import type { TMDBRecommendationResponse } from "@/types/tmdb.type";

export async function getRecommendedMovies(tmdbId: number) {
	const response = await fetch(
		`https://api.themoviedb.org/3/movie/${tmdbId}/recommendations`,
		{
			method: "GET",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
			},
		},
	);
	const data: TMDBRecommendationResponse = await response.json();
	return data.results;
}
