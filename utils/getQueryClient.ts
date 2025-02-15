"use client";

import { QueryClient } from "@tanstack/react-query";

export function getQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
	});
}
