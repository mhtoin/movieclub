import type { Prisma } from "@prisma/client"

export type TierlistWithTiers = Prisma.TierlistGetPayload<{
  include: {
    tiers: {
      include: {
        movies: {
          include: {
            movie: {
              select: {
                id: true
                images: true
                title: true
                watchDate: true
                poster_path: true
                genres: true
                user: {
                  select: {
                    id: true
                    name: true
                    image: true
                  }
                }
              }
            }
          }
          orderBy: {
            position: "asc"
          }
        }
      }
      orderBy: {
        value: "asc"
      }
    }
  }
}>

export type TierWithMovies = Prisma.TierGetPayload<{
  include: {
    movies: {
      include: {
        movie: {
          include: {
            user: true
          }
        }
      }
    }
  }
}>

export type TiersWithMovies = Prisma.TierGetPayload<{
  include: {
    movies: true
  }
}>

export type TierMovieWithMovieData = Prisma.MoviesOnTiersGetPayload<{
  include: {
    movie: {
      select: {
        id: true
        images: true
        title: true
        watchDate: true
        poster_path: true
        user: {
          select: {
            id: true
            name: true
            image: true
          }
        }
      }
    }
  }
}>
