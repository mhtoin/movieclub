"use client";

import { sortByISODate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format, formatISO, nextWednesday } from "date-fns";
import { movieKeys } from "lib/movies/movieKeys";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DateSelect from "./DateSelect";
import PosterCard from "./PosterCard";

export default function ListView() {
	const nextMovieDate = formatISO(nextWednesday(new Date()), {
		representation: "date",
	});
	const currentDate = formatISO(new Date(), {
		representation: "date",
	});
	const nextMovieMonth = nextMovieDate.split("-").slice(0, 2).join("-");
	const currentMonth = currentDate.split("-").slice(0, 2).join("-");
	const { data } = useQuery(movieKeys.next(nextMovieDate));
	const nextMovie = data?.[nextMovieMonth]?.[0];

	// Find most recent month with data if no activity
	const mostRecentMonth = Object.keys(data || {}).sort((a, b) =>
		sortByISODate(a, b, "desc"),
	)[0];

	const mostRecentMovie = data?.[mostRecentMonth]?.[0];

	const [selectedDate, setSelectedDate] = useState<string | null>(
		nextMovie ? nextMovieMonth : mostRecentMonth || currentMonth,
	);
	const router = useRouter();

	const dates = Object.keys(data || {}).map((date) => ({
		date: date,
		label: format(new Date(date), "MMMM"),
	}));

	const isScrolling = useRef(false);

	const handleDateChange = (date: string) => {
		isScrolling.current = true;
		setSelectedDate(date);
		router.push(`#${date}`);

		setTimeout(() => {
			isScrolling.current = false;
		}, 1000);
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				// Find the first entry that is intersecting
				if (isScrolling.current) return;
				const visibleEntry = entries.find((entry) => entry.isIntersecting);

				if (visibleEntry) {
					const date = visibleEntry.target.id;
					console.log("date", date);
					if (date !== selectedDate) {
						setSelectedDate(date);
					}
				}
			},
			{
				root: null, // Use viewport as root
				threshold: 0.1,
				rootMargin: "-40% 0px -40% 0px", // Creates a band in the middle of the viewport
			},
		);

		// Observe all date container elements
		const elements = document.querySelectorAll('[id^="20"]');

		for (const el of elements) {
			observer.observe(el);
		}

		return () => observer.disconnect();
	}, [selectedDate]);

	return (
		<div className="flex flex-col gap-4 h-[90%] w-[90%]  mx-auto border">
			<div className="flex justify-center sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-4">
				<DateSelect
					dates={dates}
					setSelectedDate={handleDateChange}
					selectedDate={selectedDate || ""}
				/>
			</div>

			<div className="flex flex-col gap-10 md:p-10 max-h-[100dvh] overflow-y-auto snap-y snap-mandatory scroll-smooth">
				{data &&
					Object.keys(data).map((date, index) => {
						const movies = data[date as keyof typeof data];

						if (
							data[date as keyof typeof data].length === 1 &&
							nextMovieMonth === date
						)
							return null;

						return (
							<div
								key={index}
								className="flex flex-col gap-4 relative snap-start scroll-mb-20 listview-section"
								id={date}
							>
								<div className="grid grid-cols-2 gap-5 md:gap-10 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 px-5 md:px-20 snap-start">
									{movies.map((movie) => {
										if (
											movie.watchDate === nextMovie?.watchDate ||
											(!nextMovie &&
												movie.watchDate === mostRecentMovie?.watchDate)
										)
											return null;
										return (
											<div
												className="flex flex-col items-center justify-center h-full gap-2 py-5"
												key={movie.id}
												id={movie.id}
											>
												<div className="flex items-center justify-center gap-3">
													<h1 className="text-lg md:text-2xl font-bold">
														{new Date(movie.watchDate || "").toLocaleDateString(
															"fi-FI",
														)}
													</h1>
													<div className="rounded-full border w-6 h-6 lg:w-10 lg:h-10 overflow-hidden">
														<Image
															src={movie?.user?.image || ""}
															width={50}
															height={50}
															alt="movie poster"
															priority={true}
															className="object-cover"
														/>
													</div>
												</div>
												<PosterCard movie={movie} key={movie?.id} />
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
}
