"use server";

import { validateRequest } from "@/lib/auth";
import { createTierlist, modifyTierlist } from "@/lib/tierlists";
import type { Tierlists } from "@prisma/client";
import { redirect } from "next/navigation";

export async function createNewTierlist(formData: FormData) {
	await createTierlist(formData);
	redirect("/tierlists/");
	//return createTierlist
}

export async function saveTierlist(tierlist: Tierlists) {
	return tierlist;
}

export async function recreateTierlist(formData: FormData) {
	const { user } = await validateRequest();

	const userId = user?.id;
	await modifyTierlist(formData);
	redirect(`/tierlists/${userId}`);
}
