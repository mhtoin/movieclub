import { getBlurDataUrl } from "@/lib/utils";
import type { Image, TMDBMovieResponse } from "@/types/tmdb.type";
import type { SingleImage } from "@prisma/client";
import prisma from "../lib/prisma";
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

export default async function updateMovies() {
	const movies = await prisma.movie.findMany();

	for (const movie of movies) {
		const res = await fetch(
			`https://api.themoviedb.org/3/movie/${movie.tmdbId}?append_to_response=credits,external_ids,images,similar,videos,watch/providers`,
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

		//console.dir(data, { depth: null });

		const finnishProvider = [
			...(data["watch/providers"]?.results?.FI?.flatrate ?? []),
			...(data["watch/providers"]?.results?.FI?.free ?? []),
		];
		const providerLink = data["watch/providers"]?.results?.FI?.link;
		const cast = data.credits?.cast;

		// for videos, only include trailers
		const trailers = data.videos?.results.filter(
			(video) => video.type === "Trailer",
		);

		// for images, only include those that have a height of 2160 and a width of 3840
		const backdrops = data.images?.backdrops
			? sortImages(data.images.backdrops, movie.original_language)
			: [];
		const backdropsWithBlurDataUrl: Array<SingleImage> = [];

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
		const posters = data.images?.posters
			? sortImages(data.images.posters, movie.original_language)
			: [];
		const postersWithBlurDataUrl: Array<SingleImage> = [];

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
		const logos = data.images?.logos.filter(
			(image) => image.iso_639_1 === "en" || image.vote_average > 0,
		);

		await prisma.movie.update({
			where: { id: movie.id },
			data: {
				imdbId: data.imdb_id,
				runtime: data.runtime,
				genres: data.genres,
				tagline: data.tagline,
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
			},
		});
	}
}

updateMovies();
