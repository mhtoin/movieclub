"use server";
import { groupBy } from "@/lib/utils";
import prisma from "lib/prisma";

export async function getUserRecommendedMovies(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			recommendations: {
				include: {
					movie: true,
					sourceMovie: {
						select: {
							title: true,
						},
					},
				},
			},
		},
	});

	/**
	 * Ideally we group here by the source movie
	 */

	const groupedRecommendations = groupBy(
		user?.recommendations ?? [],
		(recommendation) => recommendation.sourceMovie?.title,
	);

	return groupedRecommendations;
}
