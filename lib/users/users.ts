"use server";
import prisma from "lib/prisma";

export async function getUserRecommendedMovies(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			similarMovies: true,
		},
	});

	return user?.similarMovies;
}
