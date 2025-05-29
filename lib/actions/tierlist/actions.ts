"use server"
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"
import { formatISO } from "date-fns"

export async function createTierlist(
  userId: string,
  tiers: { value: number; label: string }[],
  dateRange?: { from: Date; to: Date } | undefined,
  genres?: string[] | undefined,
) {
  const fromDateFormatted = dateRange?.from
    ? formatISO(dateRange.from, { representation: "date" })
    : undefined
  const toDateFormatted = dateRange?.to
    ? formatISO(dateRange.to, { representation: "date" })
    : undefined

  const filters = {} as Prisma.MovieWhereInput
  if (fromDateFormatted && toDateFormatted) {
    filters.watchDate = {
      gte: fromDateFormatted,
      lte: toDateFormatted,
    }
  } else {
    filters.watchDate = {
      not: null,
    }
  }
  if (genres && genres.length > 0) {
    filters.genres = {
      hasEvery: genres,
    }
  }
  const unkrankedMovies = await db.movie.findMany({
    where: filters,
  })

  console.log("Unranked movies found:", unkrankedMovies)
  console.log("length of unranked movies:", unkrankedMovies.length)

  const tiersToCreate = tiers.concat([{ value: 0, label: "Unranked" }])

  const tierlistData = {
    title: "New Tierlist",
    user: {
      connect: {
        id: userId,
      },
    },
    tiers: {
      create: tiersToCreate.map((tier) => ({
        value: tier.value,
        label: tier.label,
      })),
    },
  } as Prisma.TierlistCreateInput

  if (dateRange) {
    tierlistData["watchDate"] = {
      from: formatISO(dateRange.from, { representation: "date" }),
      to: formatISO(dateRange.to, { representation: "date" }),
    }
  }

  if (genres && genres.length > 0) {
    tierlistData["genres"] = genres
  }
  const tierlist = await db.tierlist.create({
    data: tierlistData,
    include: {
      tiers: true,
    },
  })

  console.log("Created tierlist", tierlist)

  const unrankedTier = tierlist.tiers.find((tier) => tier.value === 0)

  if (unrankedTier && unkrankedMovies.length > 0) {
    // Now create MoviesOnTiers records for each movie
    await db.moviesOnTiers.createMany({
      data: unkrankedMovies.map((movie, index) => ({
        movieId: movie.id,
        tierId: unrankedTier.id,
        position: index, // Assign a position to each movie
      })),
    })
  }

  return tierlist
}
