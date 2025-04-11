import { createDbMovie } from "@/lib/createDbMovie";
import prisma from "@/lib/prisma";
import type { TMDBMovieResponse } from "@/types/tmdb.type";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Fixes an issue where a wrong movie was used by the user
 */
export default async function addMovieOfTheWeek() {
	const res = await fetch(
		"https://api.themoviedb.org/3/movie/474350?append_to_response=credits,external_ids,images,similar,videos,watch/providers",
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

	const movie = await createDbMovie(data);

	await prisma.movie.findUnique({
		where: {
			id: "67e436aa9b65666e6e718029",
		},
	});

	await prisma.movie.update({
		where: { id: "67e436aa9b65666e6e718029" },
		data: {
			adult: false,
			backdrop_path: "/316x475/8uO0gumD3nhx0p5W9RG8Y4qwE4d.jpg",
			genre_ids: movie.genre_ids,
			original_language: movie.original_language,
			original_title: movie.original_title,
			overview: movie.overview,
			popularity: movie.popularity,
			poster_path: movie.poster_path,
			release_date: movie.release_date,
			title: movie.title,
			video: movie.video,
			vote_average: movie.vote_average,
			vote_count: movie.vote_count,
			runtime: movie.runtime,
			tagline: movie.tagline,
			genres: movie.genres,
			watchProviders: movie.watchProviders,
			images: movie.images,
			videos: movie.videos,
			cast: movie.cast,
			watchDate: "2025-04-08",
		},
	});
}

addMovieOfTheWeek();
