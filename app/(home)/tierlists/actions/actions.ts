"use server";

import { validateRequest } from "@/lib/auth";
import {
	createTierlist,
	modifyTierlist,
	updateTierlist,
} from "@/lib/tierlists";
import type { Tierlists, TierlistsTier } from "@prisma/client";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNewTierlist(formData: FormData) {
	const _createdList = await createTierlist(formData);
	redirect("/tierlists/");
	//return createTierlist
}

export async function addMovieToTier(id: string, tiers: Array<TierlistsTier>) {
	await updateTierlist(id, tiers);

	revalidatePath("tierlists");
}

export async function saveTierlist(tierlist: Tierlists) {
	const tiers = tierlist.tiers.map((tier) => {
		const movieIds = tier.movies.map((movie) => movie);

		return {
			...tier,
			movies: movieIds,
		};
	}) as Array<TierlistsTier>;

	await updateTierlist(tierlist.id, tiers);
}

export async function recreateTierlist(formData: FormData) {
	const { user } = await validateRequest();

	const userId = user?.id;
	const _modified = await modifyTierlist(formData);
	redirect(`/tierlists/${userId}`);
}
