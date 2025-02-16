"use client";
import type { MovieWithUser } from "@/types/movie.type";
import { format } from "date-fns";
import MovieGalleryItem from "./MovieGalleryItem";

import { getMoviesOfTheMonth } from "@/lib/movies/queries";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

function DebugOverlays() {
	return (
		<>
			{/* Top overlay representing the extra 1000px above the viewport */}
			<div
				style={{
					position: "fixed",
					top: -1000,
					left: 0,
					right: 0,
					height: "1000px",
					borderBottom: "2px dashed green",
					pointerEvents: "none",
					zIndex: 1000,
				}}
			/>
			{/* Bottom overlay representing the extra 1000px below the viewport */}
			<div
				style={{
					position: "fixed",
					bottom: -1000,
					left: 0,
					right: 0,
					height: "1000px",
					borderTop: "2px dashed blue",
					pointerEvents: "none",
					zIndex: 1000,
				}}
			/>
		</>
	);
}

export default function MoviesOfTheMonth() {
	const pathname = usePathname();
	const sentinelRef = useRef<HTMLDivElement>(null);
	const currentMonth =
		useSearchParams().get("month") || format(new Date(), "yyyy-MM");
	console.log("currentMonth", currentMonth);
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSuspenseInfiniteQuery({
			queryKey: ["pastMovies"],
			queryFn: ({ pageParam }) => getMoviesOfTheMonth(pageParam),
			initialPageParam: currentMonth,
			getNextPageParam: (lastPage) => {
				console.log("lastPage", lastPage);
				if (!lastPage?.month) return undefined;
				const { month } = lastPage;
				console.log("month", month);
				// Get the next month from the current month. The shape is YYYY-MM, so we need to add one month
				const dateParts = month.split("-");
				const monthNumber = Number.parseInt(dateParts[1]);
				const yearNumber = Number.parseInt(dateParts[0]);
				const nextMonthNumber =
					monthNumber > 1 ? monthNumber - 1 : monthNumber === 1 ? 12 : 1;
				const nextYearNumber = monthNumber === 1 ? yearNumber - 1 : yearNumber;
				const nextMonthString =
					nextMonthNumber < 10 ? `0${nextMonthNumber}` : nextMonthNumber;
				const nextMonth = `${nextYearNumber}-${nextMonthString}`;

				return nextMonth;
			},
		});

	useEffect(() => {
		console.log("Setting up Intersection Observer");
		const observer = new IntersectionObserver(
			([entry]) => {
				console.log("Intersection Observer Entry:", entry);
				console.log(" - boundingClientRect:", entry.boundingClientRect);
				console.log(" - rootBounds:", entry.rootBounds);
				console.log(" - isIntersecting:", entry.isIntersecting);
				console.log(" - hasNextPage:", hasNextPage);

				if (entry.isIntersecting && hasNextPage) {
					console.log("Fetching next page...");
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

		return () => {
			console.log("Disconnecting Intersection Observer");
			observer.disconnect();
		};
	}, [hasNextPage, fetchNextPage]);

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
	}, [pathname]);

	return (
		<>
			{/* Only include these overlays when debugging */}
			<DebugOverlays />

			{data?.pages.map((page) => (
				<div
					key={page.month}
					data-month={page.month}
					className="gallery snap-start min-h-screen shrink-0 listview-section relative"
				>
					{page.movies.map((movie: MovieWithUser) => (
						<MovieGalleryItem key={movie.id} movie={movie} />
					))}
					{isFetchingNextPage && (
						<div className="fixed bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
							<Loader2Icon className="animate-spin" />
						</div>
					)}
				</div>
			))}
			<div
				ref={sentinelRef}
				className="h-6 w-full"
				style={{
					border: "2px dashed red",
					backgroundColor: "rgba(255, 0, 0, 0.1)",
				}}
			/>
		</>
	);
}
