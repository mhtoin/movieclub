import prisma from "@/lib/prisma";

export async function updateTiers() {
	const tierlist = await prisma.tierlists.findUnique({
		where: {
			id: "6738c81ef382bdc305733e29",
		},
		include: {
			tierlistTiers: {
				include: {
					movies: {
						include: {
							user: true,
						},
					},
					tierMovies: {
						include: {
							movie: {
								include: {
									user: true,
								},
							},
						},
						orderBy: {
							position: "asc",
						},
					},
				},
				orderBy: {
					value: "asc",
				},
			},
		},
	});

	const tiers = tierlist?.tierlistTiers;
	const unranked = tiers?.find((tier) => tier.label === "Unranked");

	if (!unranked) {
		console.log("No unranked tier found");
		return;
	}

	const rankedTiers = tiers?.filter((tier) => tier.label !== "Unranked");

	if (!rankedTiers) {
		console.log("No ranked tiers found");
		return;
	}

	const rankedMovieIds: string[] = [];

	for (const tier of rankedTiers) {
		const movies = tier.tierMovies.map((movie) => movie.movieId);
		rankedMovieIds.push(...movies);
	}

	console.log(rankedMovieIds);

	for (const movieId of rankedMovieIds) {
		await prisma.tier.update({
			where: {
				id: unranked.id,
			},
			data: {
				movies: { disconnect: { id: movieId } },
			},
		});
	}
}

updateTiers();
