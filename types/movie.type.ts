import type { Prisma } from '@prisma/client'

export type MovieWithUser = Prisma.MovieGetPayload<{
  include: { user: true }
}>

export type MovieWithReviews = Prisma.MovieGetPayload<{
  include: {
    user: true
    reviews: {
      select: {
        id: true
        content: true
        user: true
        rating: true
        userId: true
        timestamp: true
        movieId: true
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

export type MovieReview = Prisma.ReviewGetPayload<{
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

export type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: {
    user: true
  }
}>
