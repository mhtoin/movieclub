import type { Prisma } from '@prisma/client'

export type TierlistWithTiers = Prisma.TierlistsGetPayload<{
  include: {
    tierlistTiers: {
      include: {
        movies: {
          include: {
            user: true
          }
        }
        tierMovies: {
          include: {
            movie: {
              include: {
                user: true
              }
            }
          }
          orderBy: {
            position: 'asc'
          }
        }
      }
    }
  }
}>

export type TierWithMovies = Prisma.TierGetPayload<{
  include: {
    movies: {
      include: {
        user: true
      }
    }
  }
}>

export type TiersWithMovies = Prisma.TierGetPayload<{
  include: {
    tierMovies: {
      include: {
        movie: true
      }
    }
  }
}>

export type TierMovieWithMovieData = Prisma.TierMovieGetPayload<{
  include: {
    movie: true
  }
}>
