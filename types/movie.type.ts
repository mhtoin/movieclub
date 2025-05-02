import type { Prisma } from '@prisma/client'

export type MovieWithUser = Prisma.MovieGetPayload<{
  include: { user: true }
}>

export type MovieWithReviews = Prisma.MovieGetPayload<{
  include: {
    user: true
    tierMovies: {
      select: {
        review: true
        rating: true
        tier: {
          select: {
            tierlist: {
              select: {
                user: true
              }
            }
          }
        }
      }
    }
  }
}>

export type RecommendedMovie = Prisma.RecommendedMovieGetPayload<{
  include: {
    sourceMovie: {
      select: {
        title: true
      }
    }
    movie: true
  }
}>

export type MovieReview = Prisma.TierMovieGetPayload<{
  select: {
    review: true
    rating: true
    tier: {
      select: {
        tierlist: {
          select: {
            user: true
          }
        }
      }
    }
  }
}>
