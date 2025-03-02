"use client";

import CurrentMoviePoster from "@/components/home/CurrentMoviePoster";
import type { MovieWithReviews } from "@/types/movie.type";
import { useSearchParams } from "next/navigation";

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
	const params = useSearchParams();
	const viewMode = params.get("viewMode");

	console.log(viewMode);
	return (
		<CurrentMoviePoster mostRecentMovie={mostRecentMovie} isMobile={isMobile} />
	);
}
