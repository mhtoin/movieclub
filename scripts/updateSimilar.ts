import { updateRecommended } from "@/lib/recommended";
import prisma from "../lib/prisma";
async function updateSimilar() {
	const users = await prisma.user.findMany({
		include: {
			tierlist: {
				include: {
					tierlistTiers: {
						include: {
							movies: true,
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
			await updateRecommended(movie, user);
		}
	}
}

updateSimilar();
