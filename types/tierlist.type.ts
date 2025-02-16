import type { Prisma } from "@prisma/client";

export type TierlistWithTiers = Prisma.TierlistsGetPayload<{
	include: {
		tierlistTiers: {
			include: {
				movies: {
					include: {
						user: true;
					};
				};
			};
		};
	};
}>;

export type TierWithMovies = Prisma.TierGetPayload<{
	include: {
		movies: {
			include: {
				user: true;
			};
		};
	};
}>;
