import type { TMDBMovieResponse } from "@/types/tmdb.type";
import type { Image } from "@/types/tmdb.type";
import type { Prisma } from "@prisma/client";
import type { SingleImage as MovieImage } from "@prisma/client";
import { getBlurDataUrl } from "lib/utils";

/**
 * Including all the images and videos is probably not necessary
 * so need to cull some of them using some criteria
 * Build a function that sorts the images according to the following criteria:
 * 1. ISO 639-1 is "en" or then the original language of the movie
 * 2. Vote average is greater than 0
 * 3. Height is greater than 1920
 * 4. Width is greater than 1080
 */
function sortImages(images: Array<Image>, originalLanguage: string) {
	return [...images].sort((a, b) => {
		// First priority: dimensions that meet requirements
		const aMeetsDimensions = a.height > 1080 && a.width > 1920;
		const bMeetsDimensions = b.height > 1080 && b.width > 1920;

		if (aMeetsDimensions !== bMeetsDimensions) {
			return bMeetsDimensions ? 1 : -1;
		}

		// Second priority: vote average (descending)
		const voteDiff = b.vote_average - a.vote_average;
		if (voteDiff !== 0) return voteDiff;

		// Third priority: language preference (en first, then original language)
		const aLang = a.iso_639_1 === "en" || a.iso_639_1 === originalLanguage;
		const bLang = b.iso_639_1 === "en" || b.iso_639_1 === originalLanguage;
		if (aLang !== bLang) return aLang ? -1 : 1;

		return 0;
	});
}

export const createDbMovie = async (
	movieData: TMDBMovieResponse,
): Promise<Prisma.MovieCreateInput> => {
	const finnishProvider = [
		...(movieData["watch/providers"]?.results?.FI?.flatrate ?? []),
		...(movieData["watch/providers"]?.results?.FI?.free ?? []),
	];
	const providerLink = movieData["watch/providers"]?.results?.FI?.link;
	const cast = movieData.credits?.cast;

	const trailers = movieData.videos?.results.filter(
		(video) => video.type === "Trailer",
	);

	const backdrops = movieData.images?.backdrops
		? sortImages(movieData.images.backdrops, movieData.original_language)
		: [];
	const backdropsWithBlurDataUrl: Array<MovieImage> = [];

	for (const backdrop of backdrops.slice(0, 3)) {
		const blurDataUrl = await getBlurDataUrl(
			`https://image.tmdb.org/t/p/w300/${backdrop.file_path}`,
		);
		const backdropWithBlurDataUrl = {
			...backdrop,
			blurDataUrl,
		};
		backdropsWithBlurDataUrl.push(backdropWithBlurDataUrl);
	}

	// include only english posters
	const posters = movieData.images?.posters
		? sortImages(movieData.images.posters, movieData.original_language)
		: [];
	const postersWithBlurDataUrl: Array<MovieImage> = [];

	for (const poster of posters.slice(0, 3)) {
		const blurDataUrl = await getBlurDataUrl(
			`https://image.tmdb.org/t/p/w92/${poster.file_path}`,
		);
		const posterWithBlurDataUrl = {
			...poster,
			blurDataUrl,
		};
		postersWithBlurDataUrl.push(posterWithBlurDataUrl);
	}
	const logos = movieData.images?.logos.filter(
		(image) => image.iso_639_1 === "en" || image.vote_average > 0,
	);

	return {
		adult: movieData.adult,
		backdrop_path: movieData.backdrop_path,
		genre_ids: movieData.genres.map((genre) => genre.id),
		tmdbId: movieData.id,
		imdbId: movieData.imdb_id,
		original_language: movieData.original_language,
		original_title: movieData.original_title,
		overview: movieData.overview,
		popularity: movieData.popularity,
		poster_path: movieData.poster_path,
		release_date: movieData.release_date,
		title: movieData.title,
		video: movieData.video,
		vote_average: movieData.vote_average,
		vote_count: movieData.vote_count,
		runtime: movieData.runtime,
		tagline: movieData.tagline,
		genres: movieData.genres,
		watchProviders: {
			set: {
				link: providerLink ?? "",
				providers: finnishProvider ?? [],
			},
		},
		images: {
			set: {
				backdrops: backdropsWithBlurDataUrl,
				posters: postersWithBlurDataUrl,
				logos,
			},
		},
		videos: trailers,
		cast: cast,
	} as Prisma.MovieCreateInput;
};
