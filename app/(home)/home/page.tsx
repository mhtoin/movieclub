export const revalidate = 0;

import { getCurrentSession } from "@/lib/authentication/session";
import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import CurrentMoviePoster from "components/home/CurrentMoviePoster";
import MoviesOfTheMonth from "components/home/MoviesOfTheMonth";
import WatchDate from "components/home/WatchDate";
import { format } from "date-fns";
import { getMoviesOfTheWeekByMonth } from "lib/movies/movies";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function HomePage() {
	const queryClient = getQueryClient();

	queryClient.prefetchInfiniteQuery({
		queryKey: ["pastMovies"],
		queryFn: () => getMoviesOfTheWeekByMonth(format(new Date(), "yyyy-MM")),
		initialPageParam: format(new Date(), "yyyy-MM"),
	});
	queryClient.prefetchInfiniteQuery({
		queryKey: ["pastMovies"],
		queryFn: () => getMoviesOfTheWeekByMonth(format(new Date(), "yyyy-MM")),
		initialPageParam: format(new Date(), "yyyy-MM"),
	});

	const dehydratedState = dehydrate(queryClient);
	const { user } = await getCurrentSession();

	if (!user) {
		redirect("/");
	}

	return (
		<div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth relative">
			<div className="snap-start min-h-screen shrink-0">
				<Suspense fallback={null}>
					{/* @ts-expect-error Server Component */}
					<CurrentMoviePoster />
				</Suspense>
			</div>
			<HydrationBoundary state={dehydratedState}>
				<Suspense fallback={null}>
					<MoviesOfTheMonth />
				</Suspense>
			</HydrationBoundary>
			<div className="fixed bottom-14 left-1/2 -translate-x-1/2">
				<Suspense fallback={null}>
					<WatchDate />
				</Suspense>
			</div>
		</div>
	);
}
