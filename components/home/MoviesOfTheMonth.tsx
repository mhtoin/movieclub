"use client";
import type { MovieWithReviews } from "@/types/movie.type";
import { format } from "date-fns";
import MovieGalleryItem from "./MovieGalleryItem";

import { getMoviesOfTheMonth } from "@/lib/movies/queries";
import { getNextMonth } from "@/lib/utils";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function MoviesOfTheMonth() {
	const pathname = usePathname();
	const sentinelRef = useRef<HTMLDivElement>(null);
	const currentMonth =
		useSearchParams().get("month") || format(new Date(), "yyyy-MM");
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSuspenseInfiniteQuery({
			queryKey: ["pastMovies"],
			queryFn: ({ pageParam }) => getMoviesOfTheMonth(pageParam),
			initialPageParam: currentMonth,
			getNextPageParam: (lastPage) => {
				if (!lastPage?.month) return undefined;
				const { month } = lastPage;
				// Get the next month from the current month. The shape is YYYY-MM, so we need to add one month
				return getNextMonth(month);
			},
		});

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			},
			{
				rootMargin: "1000px 0px",
				threshold: 0,
			},
		);

		if (sentinelRef.current) {
			observer.observe(sentinelRef.current);
		}

		return () => observer.disconnect();
	}, [hasNextPage, fetchNextPage]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const month = entry.target.getAttribute("data-month");
						if (month) {
							const params = new URLSearchParams(window.location.search);
							params.set("month", month);
							window.history.replaceState({}, "", `${pathname}?${params}`);
						}
					}
				}
			},
			{ threshold: 0.5 },
		);

		const sections = document.querySelectorAll("[data-month]");
		for (const section of sections) {
			observer.observe(section);
		}

		return () => observer.disconnect();
	}, [data.pages]);

	return (
		<>
			{data?.pages.map((page) => (
				<div
					key={page.month}
					data-month={page.month}
					className="gallery snap-start min-h-screen shrink-0 listview-section relative"
				>
					{page.movies.map((movie: MovieWithReviews) => (
						<MovieGalleryItem key={movie.id} movie={movie} />
					))}
					{isFetchingNextPage && (
						<div className="fixed bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
							<Loader2Icon className="animate-spin" />
						</div>
					)}
				</div>
			))}
			<div ref={sentinelRef} className="h-6 w-full" />
		</>
	);
}
