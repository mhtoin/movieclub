import prisma from "./prisma";
import { format, isWednesday, nextWednesday, set } from "date-fns";
import { getAdditionalInfo } from "./tmdb";
import { Shortlist } from "@prisma/client";
import { every, filter, find, sample, shuffle } from "underscore";
import { getAllShortLists, updateShortlistSelectionStatus, updateShortlistState } from "./shortlist";
import { updateShortlistReadyState } from "@/app/home/shortlist/edit/actions/actions";

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
  const shortlists = await getAllShortLists();

  const selectionRequired = filter(shortlists, (shortlist) =>
    shortlist.requiresSelection ? true : false
  );

  if (selectionRequired.length > 0) {
    /**
     * Check to see that the shortlist(s) marked as needing selection have selected something
     */
    for (let listItem of selectionRequired) {
      if (
        listItem.selectedIndex === undefined ||
        listItem.selectedIndex === null
      ) {
        //console.log(listItem)
        throw new Error(
          `${listItem.user.name} needs to select a movie to include`
        );
      }
    }
  }
  const notReady = filter(shortlists, (shortlist) => !shortlist.isReady);
  //const allReady = every(shortlists, (shortlist) => shortlist.isReady)
  console.log("not ready", notReady);
  if (notReady.length > 0) {
    console.log("some users are not ready");
    throw new Error(
      `Not all users are ready: ${notReady
        .map((item) => item.user.name)
        .join(", ")}`
    );
  }

  console.log("retrieved shortlists", shortlists);
  const movies = shortlists
    .map((shortlist) => {
      if (shortlist.requiresSelection) {
        return {
          user: shortlist.user.name,
          shortlistId: shortlist.id,
          movie: shortlist.movies[shortlist.selectedIndex!]
        }
      }
      return shortlist.movies.map((movie) =>
        Object.assign(
          {},
          {
            user: shortlist.user.name,
            shortlistId: shortlist.id,
            movie: movie,
          }
        )
      );
    })
    .flat();
  // shuffle a few times
  let shuffledMovies = shuffle(movies);
  //console.log("shuffled", shuffledMovies);
  let chosen = sample(shuffledMovies);

  let movieObject = await getMovie(chosen?.movie.id!);

  // update movie with the date
  // reset selection state for the current week's winner
  // set restrictions to new winner

  //await updateChosenMovie(movieObject!)
  for (let item of shortlists) {
    await updateShortlistState(false, item.id)

    const inSelectionRequired = find(selectionRequired, (listItem) => listItem.id === item.id)
    if (inSelectionRequired) {
      await updateShortlistSelectionStatus(false, item.id)
    }

    if (item.id === chosen?.shortlistId) {
      await updateShortlistSelectionStatus(true, item.id)
    }
  }

  return {
    ...movieObject,
    owner: chosen?.user,
  } as MovieOfTheWeek;
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
