import { TierMovieWithMovieData } from "@/types/tierlist.type"
import prisma from "./prisma"

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

export async function getUserTierlists(userId: string) {
  return await prisma.tierlist.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: true,
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
              position: "asc",
            },
          },
        },
        orderBy: {
          value: "asc",
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
                  genres: true,
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
              position: "asc",
            },
          },
        },
        orderBy: {
          value: "asc",
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
      // Get the current max position in the destination tier
      const maxPositionResult = await tx.moviesOnTiers.aggregate({
        where: { tierId: destinationTierId },
        _max: { position: true },
      })

      const maxPosition = maxPositionResult._max.position ?? -1
      const targetPosition = Math.min(
        updatedSourceData.position,
        maxPosition + 1,
      )

      // Update positions of items in the source tier (shift positions down after removal)
      await tx.moviesOnTiers.updateMany({
        where: { tierId: sourceTierId, position: { gt: sourceData.position } },
        data: { position: { decrement: 1 } },
      })

      // Update positions in destination tier (shift positions up to make room)
      await tx.moviesOnTiers.updateMany({
        where: {
          tierId: destinationTierId,
          position: { gte: targetPosition },
          movieId: { not: sourceData.movieId }, // Don't update the moved item
        },
        data: {
          position: { increment: 1 },
        },
      })

      // Move the source item to the destination tier
      const destinationTierValue = await tx.moviesOnTiers.update({
        where: {
          movieId_tierId: {
            movieId: sourceData.movieId,
            tierId: sourceData.tierId,
          },
        },
        data: {
          tierId: destinationTierId,
          position: targetPosition,
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

      return {
        tierMovieId: sourceData.movieId,
        destination: destinationTierValue?.tier?.value,
        source: sourceTierValue?.value,
        movie: destinationTierValue?.movie,
        user: destinationTierValue?.tier?.tierlist?.user,
      }
    })
    .catch((e) => {
      console.error("error updating tierlist", e)
      throw new Error("error updating tierlist")
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
      // First, get the current max position in the destination tier
      const maxPositionResult = await tx.moviesOnTiers.aggregate({
        where: { tierId: destinationTierId },
        _max: { position: true },
      })

      const maxPosition = maxPositionResult._max.position ?? -1
      const targetPosition = Math.min(sourceData.position, maxPosition + 1)

      // Increment positions of existing movies at or after the target position
      await tx.moviesOnTiers.updateMany({
        where: {
          tierId: destinationTierId,
          position: { gte: targetPosition },
        },
        data: { position: { increment: 1 } },
      })

      // Create the new movie entry
      const newTierMovie = await tx.moviesOnTiers.create({
        data: {
          movieId: sourceData.movieId,
          tierId: destinationTierId,
          position: targetPosition,
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

      // Remove the source movie from the unranked source tier
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
      console.error("error updating tierlist", e)
      throw new Error("error updating tierlist")
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
