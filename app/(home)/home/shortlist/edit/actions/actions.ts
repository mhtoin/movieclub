"use server";

import {
	removeMovieFromShortlist,
	updateShortlistParticipationState,
	updateShortlistSelection,
	updateShortlistState,
} from "@/lib/shortlist";
import { revalidateTag } from "next/cache";
import "dotenv/config";
import { validateRequest } from "@/lib/auth";

export async function removeFromShortList(id: string, shortlistId: string) {
	await removeMovieFromShortlist(id, shortlistId);
	revalidate("shortlist");
}

async function revalidate(tag: string) {
	revalidateTag(tag);
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
