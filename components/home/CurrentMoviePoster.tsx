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
				className="object-cover absolute inset-0"
				quality={50}
				priority={true}
				fill
				placeholder="blur"
				blurDataURL={isMobile ? posterBlurDataUrl || "" : blurDataUrl || ""}
			/>
			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-[linear-gradient(to_top_right,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.8)_20%,rgba(0,0,0,0.7)_100%)]" />
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
