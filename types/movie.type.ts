import type { Prisma } from "@prisma/client";

export type MovieWithUser = Prisma.MovieGetPayload<{
	include: { user: true };
}>;
