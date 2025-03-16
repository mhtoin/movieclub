/**
 * Queries
 */

import type { MovieWithReviews, MovieWithUser } from "@/types/movie.type";
import type { ShortlistWithMovies } from "@/types/shortlist.type";
import type {
	TMDBMovieResponse,
	TMDBSearchResponse,
	TMDBSearchResult,
} from "@/types/tmdb.type";
import type { Provider, SiteConfig } from "@prisma/client";
import type { User as DatabaseUser } from "@prisma/client";
import { formatISO, nextWednesday, previousWednesday, set } from "date-fns";
import { getBaseURL, keyBy } from "lib/utils";
import type { User } from "lucia";

export const searchKeywords = async (value: string) => {
	const res = await fetch(
		`https://api.themoviedb.org/3/search/keyword?query=${value}`,
		{
			method: "GET",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
			},
		},
	);
	return await res.json();
};

export const getKeyWord = async (id: string) => {
	const res = await fetch(`https://api.themoviedb.org/3/keyword/${id}`, {
		method: "GET",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
		},
	});
	return await res.json();
};

export const getMovie = async (id: number) => {
	const res = await fetch(
		`https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,external_ids,images,similar,videos,watch/providers`,
		{
			method: "GET",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
			},
		},
	);
	const data: TMDBMovieResponse = await res.json();
	return data;
};

export const searchMovies = async (
	page = 1,
	searchValue = "with_watch_providers=8",
	type: "discover" | "search" = "discover",
	showOnlyAvailable = false,
) => {
	const searchQuery =
		type === "search"
			? `search/movie?query=${searchValue}&page=${page}`
			: searchValue
				? `discover/movie?${searchValue}&page=${page}&watch_region=FI`
				: "discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&watch_region=FI&release_date.gte=1900&release_date.lte=2023&vote_average.gte=0&vote_average.lte=10&with_watch_providers=8|119|323|337|384|1773";

	const initialSearch = await fetch(
		`https://api.themoviedb.org/3/${searchQuery}`,
		{
			method: "GET",
			headers: {
				accept: "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
			},
		},
	);

	if (type === "search" && showOnlyAvailable === true) {
		const siteConfig = await fetch(`${getBaseURL()}/api/siteConfig`);
		const siteConfigData: SiteConfig = await siteConfig.json();
		const data: TMDBSearchResponse = await initialSearch.json();
		const results = data.results;
		const filteredResults: TMDBSearchResult[] = [];

		for (const result of results) {
			const movie = await getMovie(result.id);
			const flatrate = movie["watch/providers"]?.results.FI?.flatrate;
			const free = movie["watch/providers"]?.results.FI?.free;

			if (
				flatrate?.find((provider) =>
					siteConfigData.watchProviders.find(
						(watchProvider) => provider.provider_id === watchProvider.provider_id,
					),
				) ||
				free?.find((provider) =>
					siteConfigData.watchProviders.find(
						(watchProvider) => provider.provider_id === watchProvider.provider_id,
					),
				)
			) {
				filteredResults.push(result);
			}
		}
		return {
			page: data.page,
			results: filteredResults,
			total_pages: Math.ceil(filteredResults.length / 20),
			total_results: filteredResults.length,
		};
	}

	return initialSearch.json();
};

export const getUserShortlist = async (id: string) => {
	const response = await fetch(`/api/shortlist/${id}`, {
		cache: "no-store",
	});
	return await response.json();
	//const shortlist = await getShortList(id);
	//return shortlist;
};

export const getWatchlist = async (user: User | DatabaseUser | null) => {
	let pagesLeft = true;
	let page = 1;
	const movies: TMDBMovieResponse[] = [];

	do {
		const watchlist = await fetch(
			`https://api.themoviedb.org/3/account/${user?.accountId}/watchlist/movies?language=en-US&page=${page}&session_id=${user?.sessionId}&sort_by=created_at.asc`,
			{
				method: "GET",
				headers: {
					accept: "application/json",
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
				},
				cache: "no-store",
			},
		);

		const data = await watchlist.json();
		const results = data?.results ?? [];
		movies.push(results);

		const pages = data?.total_pages ?? "";

		if (pages >= page) {
			page++;
		} else {
			pagesLeft = false;
		}
	} while (pagesLeft);

	return movies.flat();
};

export const getWatchProviders = async () => {
	const response = await fetch(
		"https://api.themoviedb.org/3/watch/providers/movie?language=en-US&watch_region-FI",
		{
			method: "GET",
			headers: {
				accept: "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
			},
		},
	);
	const data = await response.json();
	/**
	 * We should provide some reasonable defaults here and store them somewhere
	 */
	const providers: Provider[] = data.results.filter((provider: Provider) => {
		return (
			provider.provider_id === 8 ||
			provider.provider_id === 323 ||
			provider.provider_id === 496 ||
			provider.provider_id === 119 ||
			provider.provider_id === 337 ||
			provider.provider_id === 384 ||
			provider.provider_id === 1773
		);
	});

	// sort so that netflix, yle and cineast are first
	providers.sort((a: Provider, b: Provider) => {
		if (a.provider_id === 8) return -1;
		if (b.provider_id === 8) return 1;
		if (a.provider_id === 323) return -1;
		if (b.provider_id === 323) return 1;
		if (a.provider_id === 496) return -1;
		if (b.provider_id === 496) return 1;
		return 0;
	});
	return providers;
};

export const getFilters = async () => {
	const res = await fetch(
		"https://api.themoviedb.org/3/genre/movie/list?language=en",
		{
			method: "GET",
			headers: {
				accept: "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
			},
		},
	);

	const responseBody = await res.json();

	if (responseBody.genres) {
		return responseBody.genres.map((genre: { name: string; id: number }) => {
			return { label: genre.name, value: genre.id };
		}) as Array<{ label: string; value: number }>;
	}
};

export const getAllMoviesOfTheWeek = async () => {
	const response = await fetch(`${getBaseURL()}/api/movies`, {
		cache: "no-store",
	});

	const data: MovieWithUser[] = await response.json();
	/**
	 * The dates are a bit messed up atm, because the production server timezone differs
	 * from the development. This is a temporary fix, stripping the time part of the date
	 */
	for (const movie of data) {
		if (movie.watchDate && typeof movie.watchDate === "string") {
			movie.watchDate = formatISO(new Date(movie.watchDate), {
				representation: "date",
			});
		}
	}

	const groupedData = keyBy(
		data,
		(movie: MovieWithUser) => movie.watchDate?.toString() ?? "",
	);

	return groupedData;
};

export const getShortlist = async (id: string) => {
	const response = await fetch(`${getBaseURL()}/api/shortlist/${id}`);

	return await response.json();
};

export function findMovieDate(
	movies: Record<string, MovieWithUser>,
	startingDate: Date,
	direction: "previous" | "next" = "previous",
	tryCount = 0,
): Date | null {
	if (tryCount > Object.keys(movies).length) {
		return null;
	}
	const dateAttempt =
		direction === "previous"
			? set(previousWednesday(startingDate), {
					hours: 18,
					minutes: 0,
					seconds: 0,
					milliseconds: 0,
				})
			: set(nextWednesday(startingDate), {
					hours: 18,
					minutes: 0,
					seconds: 0,
					milliseconds: 0,
				});

	const movieOnDate = movies ? movies[dateAttempt.toISOString()] : null;

	if (movieOnDate) {
		return dateAttempt;
	}
	return findMovieDate(movies, dateAttempt, direction, tryCount + 1);
}

export async function getAllShortlistsGroupedById(): Promise<
	Record<string, ShortlistWithMovies>
> {
	const fetchUrl = `${getBaseURL()}/api/shortlist`;

	const response = await fetch(fetchUrl);

	try {
		const data: ShortlistWithMovies[] = await response.json();
		const groupedData = keyBy(data, (shortlist) => shortlist.id);
		return groupedData;
	} catch (error) {
		console.error("Error fetching shortlists", error);
		return {};
	}
}

export const getMoviesOfTheMonth = async (month: string) => {
	const response = await fetch(`${getBaseURL()}/api/movies?month=${month}`);
	const data: { month: string; movies: MovieWithReviews[] } =
		await response.json();
	return data;
};
