import type { TierMovie, TierlistTier } from '@prisma/client'
import { getCurrentSession } from './authentication/session'
import prisma from './prisma'

export const revalidate = 10

export async function getTierlists() {
  return await prisma.tierlists.findMany({
    include: {
      user: true,
      tierlistTiers: {
        include: {
          movies: true,
        },
      },
    },
  })
}

export async function getTierlist(id: string) {
  const tierlist = await prisma.tierlists.findUnique({
    where: {
      id: id,
    },
    include: {
      tierlistTiers: {
        include: {
          movies: {
            include: {
              user: true,
            },
          },
          tierMovies: {
            include: {
              movie: {
                include: {
                  user: true,
                },
              },
            },
            orderBy: {
              position: 'asc',
            },
          },
        },
        orderBy: {
          value: 'asc',
        },
      },
    },
  })

  if (tierlist?.tierlistTiers) {
    return tierlist
  }
}

export async function createTierlist(formData: FormData) {
  const { user } = await getCurrentSession()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const userId = user?.id

  const tierlistTiers = []
  for (const [key, value] of formData.entries()) {
    const tierValue = Number.parseInt(key)
    const tierLabel = value
    const movies: Array<string> = []

    if (tierValue) {
      tierlistTiers.push({
        label: tierLabel,
        value: tierValue,
        movies: movies,
      } as TierlistTier)
    }
  }

  const tierList = {
    userId: userId,
    tiers: tierlistTiers,
  }

  return await prisma.tierlists.create({
    data: tierList,
  })
}

export async function updateTierMove({
  sourceData,
  updatedSourceData,
  sourceTierId,
  destinationTierId,
}: {
  sourceData: TierMovie
  updatedSourceData: TierMovie
  sourceTierId?: string
  destinationTierId?: string
}) {
  const result = await prisma
    .$transaction(async (tx) => {
      // move the source item to the destination tier
      const destinationTierValue = await tx.tierMovie.update({
        where: { id: sourceData.id },
        data: {
          tierId: destinationTierId,
          position: updatedSourceData.position,
        },
        select: {
          id: true,
          movie: true,
          tier: {
            select: {
              value: true,
              tierlist: {
                select: {
                  user: true,
                },
              },
            },
          },
        },
      })

      const sourceTierValue = await tx.tier.findUnique({
        where: { id: sourceTierId },
        select: {
          value: true,
        },
      })

      // update the positions of the items in the source tier
      await tx.tierMovie.updateMany({
        where: { tierId: sourceTierId, position: { gt: sourceData.position } },
        data: { position: { decrement: 1 } },
      })

      await tx.tierMovie.updateMany({
        where: {
          tierId: destinationTierId,
          position: { gte: updatedSourceData.position },
          id: { not: sourceData.id }, // Don't update the moved item
        },
        data: {
          position: { increment: 1 },
        },
      })

      return {
        tierMovieId: sourceData.id,
        destination: destinationTierValue?.tier?.value,
        source: sourceTierValue?.value,
        movie: destinationTierValue?.movie,
        user: destinationTierValue?.tier?.tierlist?.user,
      }
    })
    .catch((e) => {
      console.error('error updating tierlist', e)
      throw new Error('error updating tierlist')
    })
  return result
}

export async function rankMovie({
  sourceData,
  sourceTierId,
  destinationTierId,
}: {
  sourceData: TierMovie
  sourceTierId: string
  destinationTierId: string
}) {
  const newTierMovie = await prisma
    .$transaction(async (tx) => {
      const newTierMovie = await tx.tierMovie.create({
        data: {
          movieId: sourceData.movieId,
          tierId: destinationTierId,
          position: sourceData.position,
        },
        select: {
          id: true,
          movie: true,
          tier: {
            select: {
              value: true,
              tierlist: {
                select: {
                  user: true,
                },
              },
            },
          },
        },
      })

      await tx.tierMovie.updateMany({
        where: {
          tierId: destinationTierId,
          position: { gte: sourceData.position },
          id: { not: newTierMovie.id },
        },
        data: { position: { increment: 1 } },
      })

      // finally, remove the source movie from the unranked source tier
      await tx.tier.update({
        where: { id: sourceTierId },
        data: {
          movies: {
            disconnect: {
              id: sourceData.movieId,
            },
          },
        },
      })

      return newTierMovie
    })
    .catch((e) => {
      console.error('error updating tierlist', e)
      throw new Error('error updating tierlist')
    })
  // would make sense to return the updated item here
  return newTierMovie
}

export async function updateTierlist(_id: string, items: TierMovie[]) {
  const result = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      await tx.tierMovie.update({
        where: { id: item.id },
        data: { position: item.position },
      })
    }
  })
  return result
}

export async function modifyTierlist(formData: FormData) {
  const { user } = await getCurrentSession()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const userId = user?.id
  const tierlistTiers = parseTiers(formData)

  return await prisma.tierlists.update({
    where: {
      userId: userId,
    },
    data: {
      tiers: tierlistTiers,
    },
  })
}

function parseTiers(formData: FormData) {
  const tierlistTiers = []
  for (const [key, value] of formData.entries()) {
    const tierValue = Number.parseInt(key)
    const tierLabel = value
    const movies: Array<string> = []

    if (tierValue) {
      tierlistTiers.push({
        label: tierLabel,
        value: tierValue,
        movies: movies,
      } as TierlistTier)
    }
  }

  return tierlistTiers
}
