import prisma from "./prisma";
import { format, isWednesday, nextWednesday, set } from "date-fns";
import { getAdditionalInfo } from "./tmdb";
import { Shortlist } from "@prisma/client";
import { sample, shuffle } from "underscore";
import { getAllShortLists } from "./shortlist";

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
        },
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
      timestamp: format(new Date(), "dd/MM/yyyy H:m"),
    },
  });

  return data;
}

export async function chooseMovieOfTheWeek() {
  // get an array of all the movies and the user - Array<{user, movie}>
  const shortlists = await getAllShortLists()
  console.log('retrieved shortlists', shortlists)
  const movies = shortlists
    .map((shortlist) =>
      shortlist.movies.map((movie) =>
        Object.assign(
          {},
          {
            user: shortlist.user.name,
            movie: movie,
          }
        )
      )
    )
    .flat();
  // shuffle a few times
  let shuffledMovies = shuffle(movies);
  console.log('shuffled', shuffledMovies)
  let chosen = sample(shuffledMovies);

  let movieObject = await getMovie(chosen?.movie.id!)
  
  return {
    ...movieObject,
    owner: chosen?.user
  } as MovieOfTheWeek
}

export async function updateChosenMovie(movie: Movie) {

  const nextDate = set(nextWednesday(new Date()), {
    hours: 18,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  console.log("next date", nextDate);

  let updatedMovie = await prisma.movie.update({
    where: {
      id: movie.id,
    },
    data: {
      movieOfTheWeek: nextDate,
    },
  });

  return updatedMovie;
}
