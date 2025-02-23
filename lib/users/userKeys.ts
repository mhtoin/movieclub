import type { UserRecommendations } from "@/types/user.type";
import { queryOptions } from "@tanstack/react-query";

export const userKeys = {
	all: () => ["users"] as const,
	recommended: (userId: string) =>
		queryOptions({
			queryKey: ["users", userId, "recommended"],
			queryFn: async (): Promise<UserRecommendations> => {
				const res = await fetch(`/api/users/${userId}/recommended`);
				const data: UserRecommendations = await res.json();
				return data;
			},
			enabled: !!userId,
		}),
};
