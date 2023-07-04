import prisma from "./prisma";
import { format, isWednesday, nextWednesday, set } from "date-fns";
import { getAdditionalInfo } from "./tmdb";

export async function getAllMoviesOfTheWeek() {
  const nextMovieDate = set(nextWednesday(new Date()), {
    hours: 18,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const now = isWednesday(new Date())
    ? set(new Date(), { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 })
    : nextMovieDate;

  const movies = await prisma.movie.findMany({
    where: {
      movieOfTheWeek: {
        lte: now,
      },
    },
    include: {
      reviews: true,
      ratings: true,
    },
  });

  return movies;
}

export async function getMovie(id: string) {
  const movie = await prisma.movie.findUnique({
    where: {
      id: id,
    },
    include: {
      reviews: {
        include: {
          user: true,
        }
      },
      ratings: true,
    },
  });

  const details = movie ? await getAdditionalInfo(movie?.tmdbId) : {};

  if (movie) {
    const movieObject = Object.assign(
      movie,
      details
    ) as unknown as MovieOfTheWeek;
    return movieObject;
  }
}

export async function createReview(
  review: string,
  userId: string,
  movieId: string
) {
  const data = await prisma.review.create({
    data: {
      content: review,
      userId: userId,
      movieId: movieId,
      timestamp: format(new Date(), 'dd/MM/yyyy H:m')
    },
  });

  return data;
}
