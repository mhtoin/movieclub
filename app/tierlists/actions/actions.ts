"use server"

import { createTierlist, updateTierlist } from '@/lib/tierlists';
import { TierlistsTier } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

export async function createNewTierlist(formData: FormData) {
    console.log('form data in action', formData)
    const createdList =  await createTierlist(formData)

   console.log('created', createdList)

   redirect(`/tierlists/`)
   //return createTierlist
}

export async function addMovieToTier(id: string, tiers: Array<TierlistsTier>) {
    await updateTierlist(id, tiers)

    revalidatePath('tierlists')
}

export async function saveTierlist(tierlist: Tierlist) {
    console.log('saving', tierlist)
    const tiers = tierlist.tiers.map((tier) => {
        const movieIds = tier.movies.map(movie => movie.id)

        return {
            ...tier,
            movies: movieIds
        }
    }) as Array<TierlistsTier>
    
    await updateTierlist(tierlist.id, tiers)
}