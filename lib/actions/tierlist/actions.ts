"use server"
import { db } from "@/lib/db"
import { Genre } from "@/types/tmdb.type"
import type { Prisma } from "@prisma/client"
import { formatISO } from "date-fns"

export async function createTierlist(
  userId: string,
  tiers: { value: number; label: string }[],
  dateRange?: { from: Date; to: Date } | undefined,
  genres?: Genre[] | undefined,
) {
  const tierlistData = {
    title: "New Tierlist",
    user: {
      connect: {
        id: userId,
      },
    },
    tiers: {
      create: tiers.map((tier) => ({
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
  })

  console.log("Created tierlist", tierlist)

  return tierlist
}
