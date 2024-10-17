"use server";

import { validateRequest } from "@/lib/auth";
import {
  createTierlist,
  modifyTierlist,
  updateTierlist,
} from "@/lib/tierlists";
import { TierlistsTier } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNewTierlist(formData: FormData) {
  const createdList = await createTierlist(formData);
  redirect(`/tierlists/`);
  //return createTierlist
}

export async function addMovieToTier(id: string, tiers: Array<TierlistsTier>) {
  await updateTierlist(id, tiers);

  revalidatePath("tierlists");
}

export async function saveTierlist(tierlist: Tierlist) {
  const tiers = tierlist.tiers.map((tier) => {
    const movieIds = tier.movies.map((movie) => movie.id);

    return {
      ...tier,
      movies: movieIds,
    };
  }) as Array<TierlistsTier>;

  await updateTierlist(tierlist.id, tiers);
}

export async function recreateTierlist(formData: FormData) {
  const { user, session } = await validateRequest();

  const userId = user?.id;
  const modified = await modifyTierlist(formData);
  redirect(`/tierlists/${userId}`);
}
