"use client";

import CurrentMoviePoster from "@/components/home/CurrentMoviePoster";
import type { MovieWithReviews } from "@/types/movie.type";

/**
 *
 * Client component for handling display state
 */
export default function CurrentMovie({
	mostRecentMovie,
	isMobile,
}: {
	mostRecentMovie: MovieWithReviews;
	isMobile: boolean;
}) {
	return (
		<CurrentMoviePoster mostRecentMovie={mostRecentMovie} isMobile={isMobile} />
	);
}
