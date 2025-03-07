"use client";
import MovieDetails from "@/components/home/MovieDetails";
import MovieReviews from "@/components/home/MovieReviews";
import type { MovieWithReviews } from "@/types/movie.type";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function CurrentMoviePoster({
	mostRecentMovie,
	isMobile,
}: {
	mostRecentMovie: MovieWithReviews;
	isMobile: boolean;
}) {
	const params = useSearchParams();
	const viewMode = params.get("viewMode");
	const backgroundImage = mostRecentMovie?.images?.backdrops[0]?.file_path
		? `https://image.tmdb.org/t/p/original/${mostRecentMovie?.images?.backdrops[0]?.file_path}`
		: `https://image.tmdb.org/t/p/original/${mostRecentMovie?.backdrop_path}`;
	const posterImage = mostRecentMovie?.images?.posters[0]?.file_path
		? `https://image.tmdb.org/t/p/original/${mostRecentMovie?.images?.posters[0]?.file_path}`
		: `https://image.tmdb.org/t/p/original/${mostRecentMovie?.poster_path}`;
	const blurDataUrl = mostRecentMovie?.images?.backdrops[0]?.blurDataUrl;
	const posterBlurDataUrl = mostRecentMovie?.images?.posters[0]?.blurDataUrl;

	return (
		<div className="w-full h-full ">
			<Image
				src={isMobile ? posterImage : backgroundImage}
				alt={mostRecentMovie?.title}
				className="object-cover absolute inset-0 sepia-[0.35] [mask-image:radial-gradient(100%_100%_at_100%_0,#fff,transparent)]"
				quality={50}
				priority={true}
				fill
				placeholder="blur"
				blurDataURL={isMobile ? posterBlurDataUrl || "" : blurDataUrl || ""}
			/>
			{/* @ts-ignore */}
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
						<MovieDetails mostRecentMovie={mostRecentMovie} />
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
