"use client";

import {
	QueryClient,
	QueryClientProvider,
	isServer,
} from "@tanstack/react-query";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 60 * 1000,
			},
		},
	});
}

const browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
	});
}

/*
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // per default, only successful Queries are included,
        // this includes pending Queries as well
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}*/

//export const getQueryClient = cache(() => new QueryClient());
