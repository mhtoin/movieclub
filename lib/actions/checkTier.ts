"use server";

import { getCurrentSession } from "@/lib/authentication/session";
import prisma from "@/lib/prisma";

export async function checkTier(movieId: string) {
	const { user } = await getCurrentSession();

	if (!user) {
		return { error: "Unauthorized" };
	}

	if (!user.tierlistId) {
		return { error: "No tierlist found" };
	}

	const userUnrankedTier = await prisma.tier.findFirst({
		where: {
			tierlistId: user?.tierlistId,
			value: 0,
		},
	});

	if (!userUnrankedTier) {
		return { error: "No unranked tier found" };
	}

	const movieIsUnRanked = userUnrankedTier.movieIds.includes(movieId);

	if (movieIsUnRanked) {
		return { error: "Movie is unranked" };
	}

	return { success: true };
}
