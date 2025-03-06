export const revalidate = 0;

import { CurrentMovieWrapper } from "@/components/home/CurrentMovieWrapper";
import MovieSidebar from "@/components/home/MovieSidebar";
import { getCurrentSession } from "@/lib/authentication/session";
import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import MoviesOfTheMonth from "components/home/MoviesOfTheMonth";
import { format } from "date-fns";
import { getAllMonths, getMoviesOfTheWeekByMonth } from "lib/movies/movies";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function HomePage() {
	const queryClient = getQueryClient();

	queryClient.prefetchInfiniteQuery({
		queryKey: ["pastMovies"],
		queryFn: () => getMoviesOfTheWeekByMonth(format(new Date(), "yyyy-MM")),
		initialPageParam: format(new Date(), "yyyy-MM"),
	});

	const dehydratedState = dehydrate(queryClient);
	const { user } = await getCurrentSession();
	const months = await getAllMonths();

	if (!user) {
		redirect("/");
	}

	return (
		<div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth relative">
			<div className="snap-start min-h-screen shrink-0">
				<Suspense fallback={null}>
					{/* @ts-expect-error Server Component */}
					<CurrentMovieWrapper />
				</Suspense>
			</div>
			<HydrationBoundary state={dehydratedState}>
				<Suspense fallback={null}>
					<MoviesOfTheMonth />
				</Suspense>
				<MovieSidebar months={months} />
			</HydrationBoundary>
		</div>
	);
}
