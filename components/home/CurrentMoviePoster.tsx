"use client";
import DetailsView from "@/components/home/DetailsView";
import MovieReviews from "@/components/home/MovieReviews";
import ViewModeButtons from "@/components/home/ViewModeButtons";
import type { MovieWithReviews } from "@/types/movie.type";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function CurrentMoviePoster({
	mostRecentMovie,
	isMobile,
}: {
	mostRecentMovie: MovieWithReviews;
	isMobile: boolean;
}) {
	const params = useSearchParams();
	const router = useRouter();
	const containerRef = useRef<HTMLDivElement>(null);
	const viewMode = params.get("viewMode");

	// Set up Intersection Observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						// Component is in view, update search params
						// Preserve existing parameters
						const currentParams = new URLSearchParams(params.toString());

						// Add movie date parameters
						const watchDate = mostRecentMovie?.watchDate?.split("-");
						const month = watchDate?.[1];
						const day = watchDate?.[2];
						const year = watchDate?.[0];

						currentParams.set("month", `${year}-${month}`);

						currentParams.set("date", day || "");

						// Only set viewMode if it exists
						if (viewMode) {
							currentParams.set("viewMode", viewMode);
						}

						// Create parameter string with all parameters
						const paramsString = `?${currentParams.toString()}`;

						router.push(paramsString, {
							scroll: false,
						});
					}
				}
			},
			{ threshold: 0.3 },
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			if (containerRef.current) {
				observer.unobserve(containerRef.current);
			}
		};
	}, [router, mostRecentMovie, viewMode, params.toString]);

	const backgroundImage = mostRecentMovie?.images?.backdrops[0]?.file_path
		? `https://image.tmdb.org/t/p/original/${mostRecentMovie?.images?.backdrops[0]?.file_path}`
		: `https://image.tmdb.org/t/p/original/${mostRecentMovie?.backdrop_path}`;
	const posterImage = mostRecentMovie?.images?.posters[0]?.file_path
		? `https://image.tmdb.org/t/p/original/${mostRecentMovie?.images?.posters[0]?.file_path}`
		: `https://image.tmdb.org/t/p/original/${mostRecentMovie?.poster_path}`;
	const blurDataUrl = mostRecentMovie?.images?.backdrops[0]?.blurDataUrl;
	const posterBlurDataUrl = mostRecentMovie?.images?.posters[0]?.blurDataUrl;

	return (
		<div className="w-full h-full relative" ref={containerRef}>
			<ViewModeButtons />
			<Image
				src={isMobile ? posterImage : backgroundImage}
				alt={mostRecentMovie?.title}
				className="object-cover absolute inset-0 sepia-[0.35] [mask-image:radial-gradient(100%_100%_at_100%_0,#fff,transparent)]"
				quality={50}
				priority={true}
				fill
				placeholder={blurDataUrl || posterBlurDataUrl ? "blur" : "empty"}
				blurDataURL={isMobile ? posterBlurDataUrl || "" : blurDataUrl || ""}
			/>
			<AnimatePresence mode="wait">
				{(viewMode === "details" || !viewMode) && (
					<motion.div
						key="details"
						className="absolute inset-0 overflow-hidden"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.3 }}
					>
						<DetailsView movie={mostRecentMovie} isExpanded={true} />
					</motion.div>
				)}
				{viewMode === "reviews" && (
					<motion.div
						key="reviews"
						className="absolute inset-0 overflow-hidden"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3 }}
					>
						<MovieReviews movieReviews={mostRecentMovie?.tierMovies} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
