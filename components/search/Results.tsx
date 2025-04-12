"use client";
import {
	useDiscoverSuspenseInfiniteQuery,
	useGetWatchlistQuery,
	useShortlistQuery,
	useValidateSession,
} from "@/lib/hooks";
import type { MovieWithUser } from "@/types/movie.type";
import type { TMDBMovieResponse } from "@/types/tmdb.type";
import { Button } from "components/ui/Button";
import { ChevronUp } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";
import MovieCard from "./MovieCard";

export default function Results() {
	const { data: user } = useValidateSession();
	const loadMoreButtonRef = useRef<HTMLButtonElement>(null);
	const resultsContainerRef = useRef<HTMLDivElement>(null);

	const { data: shortlist } = useShortlistQuery(user?.shortlistId ?? "");
	const { data: watchlist } = useGetWatchlistQuery(user ? user : null);

	const { data, hasNextPage, fetchNextPage } =
		useDiscoverSuspenseInfiniteQuery();

	useEffect(() => {
		if (!hasNextPage) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						fetchNextPage();
					}
				}
			},
			{ root: null, rootMargin: "10px", threshold: 0.1 },
		);
		const el = loadMoreButtonRef?.current;
		if (!el) {
			return;
		}

		observer.observe(el);

		return () => {
			observer.unobserve(el);
		};
	}, [hasNextPage, fetchNextPage]);
	const shortlistMovieIds =
		shortlist?.movies?.map((movie: MovieWithUser) => movie.tmdbId) ?? [];

	const watchlistMovieIds = watchlist?.map((movie) => movie.id) ?? [];
	return (
		<div className="w-full h-full flex flex-col gap-2">
			<div className="flex flex-row items-center justify-center p-5 gap-5">
				<span className="text-md text-muted-foreground">
					{`Showing ${data?.pages[0]?.total_results} results (page ${data?.pages.length} of ${data?.pages[0]?.total_pages})` ||
						"No results found"}
				</span>
				{/* Causes hydration error */}
				<Button
					variant="outline"
					size="icon"
					className="ml-auto"
					tooltip="Scroll to top"
					onClick={() => {
						resultsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
					}}
				>
					<ChevronUp className="w-4 h-4" />
				</Button>
			</div>

			<div
				className="relative h-dvh w-full overflow-y-auto no-scrollbar"
				ref={resultsContainerRef}
			>
				<div className="sticky top-0 left-0 right-0 h-5 bg-linear-to-b from-background to-transparent z-10" />
				<div className="h-dvh w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] auto-rows-[min-content] place-items-center gap-y-5 bg-background relative">
					{data
						? data?.pages?.map((page) => (
								<Fragment key={page.page}>
									{page.results.map((movie: TMDBMovieResponse) => {
										return (
											<MovieCard
												key={movie.id}
												movie={movie}
												added={shortlistMovieIds?.includes(movie.id)}
												inWatchlist={watchlistMovieIds?.includes(movie.id)}
												showActions
											/>
										);
									})}
								</Fragment>
							))
						: []}
					{hasNextPage && (
						<Button
							variant="outline"
							size="lg"
							className="max-w-sm m-auto opacity-0 h-[1px] min-h-[1px]"
							ref={loadMoreButtonRef}
						>
							Load More
						</Button>
					)}
				</div>
				<div className="fixed bottom-0 left-0 right-0 h-5 bg-linear-to-t from-background to-transparent z-10" />
			</div>
		</div>
	);
}
