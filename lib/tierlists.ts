import { getServerSession } from "next-auth";
import prisma from "./prisma";
import { TierlistsTier } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export const revalidate = 10;

export async function getTierlists() {
    return await prisma.tierlists.findMany({
        include: {
            user: true
        }
    })
}

export async function getTierlist(id: string) {
    const tierlist = await prisma.tierlists.findUnique({
        where: {
            userId: id
        }
    })

    const tiersWithMovies = []

    if (tierlist) {
        for (let tier of tierlist.tiers) {
            const tierObj = { label: tier.label, value: tier.value, movies: []} as Tier
            const movies = []
            for (let movie of tier.movies) {
                // get the movie from db
                const movieInDb = await prisma.movie.findUnique({
                    where: {
                        id: movie
                    }
                })
    
                if (movieInDb) {
                    movies.push(movieInDb)
                }
            }
            tierObj.movies = movies as unknown as Array<MovieOfTheWeek>
            tiersWithMovies.push(tierObj)
        }
    }
    
    // need to fetch all the movies in the tiers
    
    return {...tierlist, tiers: tiersWithMovies} as Tierlist
}

export async function createTierlist(formData: FormData) {
    const session = await getServerSession(authOptions)
    
    const userId = session?.user?.userId

    
    const tierlistTiers = []
    for (let [key, value] of formData.entries()) {
        let tierValue = parseInt(key)
        let tierLabel = value
        let movies: Array<String> = []

        if (tierValue) {
            tierlistTiers.push({
                label: tierLabel,
                value: tierValue,
                movies: movies
            } as unknown as TierlistsTier)
        } 
    }

    
    const tierList = {
        userId: userId,
        tiers: tierlistTiers
    }
   
    return await prisma.tierlists.create({
        data: tierList
    })
}

export async function updateTierlist(id: string, tiers: Array<TierlistsTier>) {
    return await prisma.tierlists.update({
        where: {
            id: id
        },
        data: {
            tiers: tiers
        }
    })
}

export async function modifyTierlist(formData: FormData) {
    const session = await getServerSession(authOptions)
    
    const userId = session?.user?.userId
    const tierlistTiers = parseTiers(formData)

    return await prisma.tierlists.update({
        where: {
            userId: userId
        },
        data: {
            tiers: tierlistTiers
        }
    })
}

function parseTiers(formData: FormData) {
    const tierlistTiers = []
    for (let [key, value] of formData.entries()) {
        let tierValue = parseInt(key)
        let tierLabel = value
        let movies: Array<String> = []

        if (tierValue) {
            tierlistTiers.push({
                label: tierLabel,
                value: tierValue,
                movies: movies
            } as unknown as TierlistsTier)
        } 
    }

    return tierlistTiers

}