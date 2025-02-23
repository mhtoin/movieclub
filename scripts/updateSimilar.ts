import { createDbMovie } from "@/lib/createDbMovie";
import { getRecommendedMovies } from "@/lib/getSimilarMovies";
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
			const recommended = await getRecommendedMovies(movie.tmdbId);
			const topFiveRecommended = recommended.slice(0, 5);

			// find or create if missing from database
			for (const recommendedMovie of topFiveRecommended) {
				const existingMovie = await prisma.movie.findUnique({
					where: {
						tmdbId: recommendedMovie.id,
					},
					include: {
						recommendations: true,
					},
				});
				console.log("existingMovie", existingMovie);

				if (!existingMovie) {
					console.log(
						`Creating movie ${recommendedMovie.id} ${recommendedMovie.title}`,
					);
					const detailsRes = await fetch(
						`https://api.themoviedb.org/3/movie/${recommendedMovie.id}?append_to_response=credits,external_ids,images,similar,videos,watch/providers`,
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
							recommendations: {
								create: {
									user: {
										connect: {
											id: user.id,
										},
									},
									sourceMovie: {
										connect: {
											id: movie.id,
										},
									},
								},
							},
						},
					});
				} else {
					console.log(
						`Connecting movie ${recommendedMovie.id} ${recommendedMovie.title} to user ${user.id}`,
					);
					await prisma.movie.update({
						where: {
							id: existingMovie.id,
						},
						data: {
							recommendations: {
								create: {
									user: {
										connect: {
											id: user.id,
										},
									},
									sourceMovie: {
										connect: {
											id: movie.id,
										},
									},
								},
							},
						},
					});
				}
			}
		}
	}
}

updateSimilar();
