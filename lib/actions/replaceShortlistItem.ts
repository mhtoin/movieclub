"use server";

import type { MovieWithUser } from "@/types/movie.type";
import { replaceShortlistMovie } from "lib/shortlist";

export async function replaceShortlistItem(
	replacedMovie: MovieWithUser,
	replacingWithMovie: MovieWithUser,
	shortlistId: string,
) {
	return await replaceShortlistMovie(
		replacedMovie,
		replacingWithMovie,
		shortlistId,
	);
}
