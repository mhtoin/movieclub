import type { TierlistWithTiers } from "@/types/tierlist.type";
import type { TierlistTier } from "@prisma/client";
import { validateRequest } from "./auth";
import prisma from "./prisma";

export const revalidate = 10;

export async function getTierlists() {
	return await prisma.tierlists.findMany({
		include: {
			user: true,
			tierlistTiers: {
				include: {
					movies: true,
				},
			},
		},
	});
}

export async function getTierlist(id: string) {
	const tierlist = await prisma.tierlists.findUnique({
		where: {
			id: id,
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

	if (tierlist?.tierlistTiers) {
		return tierlist;
	}
}

export async function createTierlist(formData: FormData) {
	const { user } = await validateRequest();

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
			} as TierlistTier);
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

export async function updateTierlist(id: string, tierList: TierlistWithTiers) {
	return await prisma.tierlists.update({
		where: { id },
		data: {
			tierlistTiers: {
				update: tierList.tierlistTiers.map((tier) => ({
					where: { id: tier.id },
					data: {
						label: tier.label,
						value: tier.value,
						movies: {
							set: tier.movies.map((movie) => ({ id: movie.id })),
						},
					},
				})),
			},
		},
	});
}

export async function modifyTierlist(formData: FormData) {
	const { user } = await validateRequest();

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
			} as TierlistTier);
		}
	}

	return tierlistTiers;
}
