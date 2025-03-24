import { updateRecommended } from "@/lib/recommended";
import prisma from "../lib/prisma";
async function updateRecommendations() {
	console.log("Updating recommended movies");
	const user = await prisma.user.findUnique({
		where: {
			id: "6526deb063803415502c443d",
		},
		include: {
			tierlist: {
				include: {
					tierlistTiers: {
						include: {
							tierMovies: {
								include: {
									movie: true,
								},
							},
						},
					},
				},
			},
		},
	});

	if (!user) {
		console.log("User not found");
		return;
	}

	console.log("user", user);

	const tierlist = user.tierlist;
	const tierlistTiers = tierlist?.tierlistTiers.filter(
		(tier) => tier.value === 1 || tier.value === 2,
	);
	console.log("tierlistTiers", tierlistTiers);
	const movies = tierlistTiers?.flatMap((tier) =>
		tier.tierMovies.map((movie) => movie.movie),
	);

	if (!movies) {
		console.log("No movies found");
		return;
	}

	for (const movie of movies) {
		await updateRecommended(movie, user);
	}
}

updateRecommendations();
