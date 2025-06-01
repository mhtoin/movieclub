"use server"
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"
import { formatISO } from "date-fns"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { DateRange } from "react-day-picker"

export async function createTierlistAction(formData: FormData) {
  "use server"

  const userId = formData.get("userId") as string
  const tiers: { value: number; label: string }[] = JSON.parse(
    formData.get("tiers") as string,
  )
  const dateRange: DateRange = formData.get("dateRange")
    ? JSON.parse(formData.get("dateRange") as string)
    : undefined
  const genres: string[] | undefined = formData.get("genres")
    ? JSON.parse(formData.get("genres") as string)
    : undefined

  const fromDateFormatted = dateRange?.from
    ? formatISO(new Date(dateRange.from), { representation: "date" })
    : undefined
  const toDateFormatted = dateRange?.to
    ? formatISO(new Date(dateRange.to), { representation: "date" })
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

  if (fromDateFormatted && toDateFormatted) {
    tierlistData["watchDate"] = {
      from: fromDateFormatted,
      to: toDateFormatted,
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
    await db.moviesOnTiers.createMany({
      data: unkrankedMovies.map((movie, index) => ({
        movieId: movie.id,
        tierId: unrankedTier.id,
        position: index,
      })),
    })
  }

  console.log("Creating tierlist with data:", {
    userId,
    tiers,
    dateRange,
    genres,
  })

  revalidatePath(`/tierlists/${userId}`)
  redirect(`/tierlists/${userId}/${tierlist.id}`)
}

export async function deleteTierlist(tierlistId: string) {
  const tierlist = await db.tierlist.delete({
    where: {
      id: tierlistId,
    },
  })

  console.log("Deleted tierlist", tierlist)

  // Revalidate the specific user's tierlist page
  revalidatePath(`/tierlists/${tierlist.userId}`)

  return tierlist
}
