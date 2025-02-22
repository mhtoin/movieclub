import { createDbMovie } from "@/lib/createDbMovie";
import { getSimilarMovies } from "@/lib/getSimilarMovies";
import type { TMDBMovieResponse } from "@/types/tmdb.type";
import prisma from "../lib/prisma";
async function updateSimilar() {
	const users = await prisma.user.findMany({
		include: {
			tierlist: {
				include: {
					tierlistTiers: {
						include: {
							movies: {
								select: {
									id: true,
									tmdbId: true,
									title: true,
								},
							},
						},
					},
				},
			},
		},
	});

	for (const user of users) {
		const tierlist = user.tierlist;
		const tierlistTiers = tierlist?.tierlistTiers.filter(
			(tier) => tier.value === 1 || tier.value === 2,
		);
		const movies = tierlistTiers?.flatMap((tier) => tier.movies);

		if (!movies) {
			continue;
		}

		for (const movie of movies) {
			const similarMovies = await getSimilarMovies(movie.tmdbId);
			const topFiveSimilarMovies = similarMovies.slice(0, 5);

			// find or create if missing from database
			for (const similarMovie of topFiveSimilarMovies) {
				const existingMovie = await prisma.movie.findUnique({
					where: {
						tmdbId: similarMovie.id,
					},
					include: {
						similarForUser: true,
					},
				});
				console.log("existingMovie", existingMovie);

				if (!existingMovie) {
					console.log(`Creating movie ${similarMovie.id} ${similarMovie.title}`);
					const detailsRes = await fetch(
						`https://api.themoviedb.org/3/movie/${similarMovie.id}?append_to_response=credits,external_ids,images,similar,videos,watch/providers`,
						{
							method: "GET",
							headers: {
								accept: "application/json",
								"content-type": "application/json",
								Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
							},
						},
					);
					const movieDetails: TMDBMovieResponse = await detailsRes.json();
					console.log("movieDetails", movieDetails);
					const movieObject = await createDbMovie(movieDetails);
					console.log("movieObject", movieObject);
					await prisma.movie.create({
						data: {
							...movieObject,
							similarForUser: {
								connect: {
									id: user.id,
								},
							},
						},
					});
				} else {
					console.log(
						`Connecting movie ${similarMovie.id} ${similarMovie.title} to user ${user.id}`,
					);
					await prisma.movie.update({
						where: {
							id: existingMovie.id,
						},
						data: {
							similarForUser: {
								connect: {
									id: user.id,
								},
							},
						},
					});
				}
			}
		}

		//console.dir(movies, { depth: null });
	}
}

updateSimilar();
