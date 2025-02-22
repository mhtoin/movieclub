import type { Movie } from "@prisma/client";
import { queryOptions } from "@tanstack/react-query";

export const userKeys = {
	all: () => ["users"] as const,
	recommended: (userId: string) =>
		queryOptions({
			queryKey: ["users", userId, "recommended"],
			queryFn: async (): Promise<Movie[]> => {
				const res = await fetch(`/api/users/${userId}/recommended`);
				return res.json();
			},
			enabled: !!userId,
		}),
};
