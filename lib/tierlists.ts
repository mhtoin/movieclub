import { TierMovieWithMovieData } from '@/types/tierlist.type'
import prisma from './prisma'

export async function getTierlists() {
  return await prisma.tierlist.findMany({
    include: {
      user: true,
      tiers: {
        include: {
          movies: true,
        },
      },
    },
  })
}

export async function getTierlist(id: string) {
  const tierlist = await prisma.tierlist.findUnique({
    where: {
      id: id,
    },
    include: {
      tiers: {
        include: {
          movies: {
            include: {
              movie: {
                select: {
                  id: true,
                  images: true,
                  title: true,
                  watchDate: true,
                  poster_path: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
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

  if (tierlist?.tiers) {
    return tierlist
  }
}

export async function updateTierMove({
  sourceData,
  updatedSourceData,
  sourceTierId,
  destinationTierId,
}: {
  sourceData: TierMovieWithMovieData
  updatedSourceData: TierMovieWithMovieData
  sourceTierId?: string
  destinationTierId?: string
}) {
  const result = await prisma
    .$transaction(async (tx) => {
      // move the source item to the destination tier
      const destinationTierValue = await tx.moviesOnTiers.update({
        where: {
          movieId_tierId: {
            movieId: sourceData.movieId,
            tierId: sourceData.tierId,
          },
        },
        data: {
          tierId: destinationTierId,
          position: updatedSourceData.position,
        },
        include: {
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
      await tx.moviesOnTiers.updateMany({
        where: { tierId: sourceTierId, position: { gt: sourceData.position } },
        data: { position: { decrement: 1 } },
      })

      await tx.moviesOnTiers.updateMany({
        where: {
          tierId: destinationTierId,
          position: { gte: updatedSourceData.position },
          movieId: { not: sourceData.movieId }, // Don't update the moved item
        },
        data: {
          position: { increment: 1 },
        },
      })

      return {
        tierMovieId: sourceData.movieId,
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
  sourceData: TierMovieWithMovieData
  sourceTierId: string
  destinationTierId: string
}) {
  const newTierMovie = await prisma
    .$transaction(async (tx) => {
      const newTierMovie = await tx.moviesOnTiers.create({
        data: {
          movieId: sourceData.movieId,
          tierId: destinationTierId,
          position: sourceData.position,
        },
        include: {
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

      await tx.moviesOnTiers.updateMany({
        where: {
          tierId: destinationTierId,
          position: { gte: sourceData.position },
          movieId: { not: newTierMovie.movieId },
        },
        data: { position: { increment: 1 } },
      })

      // finally, remove the source movie from the unranked source tier
      await tx.moviesOnTiers.delete({
        where: {
          movieId_tierId: {
            movieId: sourceData.movieId,
            tierId: sourceTierId,
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

export async function updateTierlist(
  _id: string,
  items: TierMovieWithMovieData[],
) {
  const result = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      await tx.moviesOnTiers.update({
        where: {
          movieId_tierId: { movieId: item.movieId, tierId: item.tierId },
        },
        data: { position: item.position },
      })
    }
  })
  return result
}
