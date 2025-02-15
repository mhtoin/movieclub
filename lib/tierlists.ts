import type { TierlistsTier } from "@prisma/client";
import { validateRequest } from "./auth";
import prisma from "./prisma";

export const revalidate = 10;

export async function getTierlists() {
	return await prisma.tierlists.findMany({
		include: {
			user: true,
		},
	});
}

export async function getTierlist(id: string) {
	const tierlist = await prisma.tierlists.findUnique({
		where: {
			id: id,
		},
	});

	const tiersWithMovies = [];

	if (tierlist) {
		for (const tier of tierlist.tiers) {
			const tierObj = {
				label: tier.label,
				value: tier.value,
				movies: [],
			} as Tier;
			const movies = [];
			for (const movie of tier.movies) {
				// get the movie from db
				const movieInDb = await prisma.movie.findUnique({
					where: {
						id: movie,
					},
				});

				if (movieInDb) {
					movies.push(movieInDb);
				}
			}
			tierObj.movies = movies as unknown as Array<MovieOfTheWeek>;
			tiersWithMovies.push(tierObj);
		}
	}

	// need to fetch all the movies in the tiers

	return { ...tierlist, tiers: tiersWithMovies } as Tierlist;
}

export async function createTierlist(formData: FormData) {
	const { user, session } = await validateRequest();

	const userId = user?.id;

	const tierlistTiers = [];
	for (const [key, value] of formData.entries()) {
		const tierValue = Number.parseInt(key);
		const tierLabel = value;
		const movies: Array<string> = [];

		if (tierValue) {
			tierlistTiers.push({
				label: tierLabel,
				value: tierValue,
				movies: movies,
			} as unknown as TierlistsTier);
		}
	}

	const tierList = {
		userId: userId,
		tiers: tierlistTiers,
	};

	return await prisma.tierlists.create({
		data: tierList,
	});
}

export async function updateTierlist(id: string, tiers: Array<TierlistsTier>) {
	return await prisma.tierlists.update({
		where: {
			id: id,
		},
		data: {
			tiers: tiers,
		},
	});
}

export async function modifyTierlist(formData: FormData) {
	const { user, session } = await validateRequest();

	const userId = user?.id;
	const tierlistTiers = parseTiers(formData);

	return await prisma.tierlists.update({
		where: {
			userId: userId,
		},
		data: {
			tiers: tierlistTiers,
		},
	});
}

function parseTiers(formData: FormData) {
	const tierlistTiers = [];
	for (const [key, value] of formData.entries()) {
		const tierValue = Number.parseInt(key);
		const tierLabel = value;
		const movies: Array<string> = [];

		if (tierValue) {
			tierlistTiers.push({
				label: tierLabel,
				value: tierValue,
				movies: movies,
			} as unknown as TierlistsTier);
		}
	}

	return tierlistTiers;
}
