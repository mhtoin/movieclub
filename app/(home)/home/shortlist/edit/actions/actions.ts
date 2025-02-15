"use server";

import {
	removeMovieFromShortlist,
	updateChosenMovie,
	updateShortlistParticipationState,
	updateShortlistSelection,
	updateShortlistState,
} from "@/lib/shortlist";
import type { Movie, Shortlist, User } from "@prisma/client";
import { revalidateTag } from "next/cache";
import "dotenv/config";
import { validateRequest } from "@/lib/auth";
import { sample } from "@/lib/utils";

export async function removeFromShortList(id: string, shortlistId: string) {
	const _res = await removeMovieFromShortlist(id, shortlistId);
	//revalidateTag("shortlist");
	revalidate("shortlist");
}

async function revalidate(tag: string) {
	revalidateTag(tag);
}

export async function startRaffle(
	shortlists: (Shortlist & {
		user: User;
		movies: Movie[];
	})[],
) {
	const movies = shortlists.flatMap((shortlist) =>
		shortlist.movies.map((movie) =>
			Object.assign(
				{},
				{
					user: shortlist.user.name,
					movie: movie,
				},
			),
		),
	);
	const movieChoice = sample(movies, true) ?? "";

	if (movieChoice) {
		// update movie in db
		const _chosenMovie = await updateChosenMovie(movieChoice.movie);
	}
}

export async function getColours(img: string) {
	const _imageData = await fetch(img);
}

export async function updateShortlistReadyState(ready: boolean) {
	const { user } = await validateRequest();
	await updateShortlistState(ready, user?.shortlistId || "");
}

export async function updateShortlistParticipation(ready: boolean) {
	const { user } = await validateRequest();
	await updateShortlistParticipationState(ready, user?.shortlistId || "");
}

export async function updateSelection(index: number) {
	const { user } = await validateRequest();
	await updateShortlistSelection(index, user?.shortlistId || "");
}
