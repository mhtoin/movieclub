import type { Prisma } from "@prisma/client";

export type MovieWithUser = Prisma.MovieGetPayload<{
	include: { user: true };
}>;

export type RecommendedMovie = Prisma.RecommendedMovieGetPayload<{
	include: {
		sourceMovie: {
			select: {
				title: true;
			};
		};
		movie: true;
	};
}>;
