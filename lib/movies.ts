import prisma from "./prisma";
import { format, isWednesday, nextWednesday, set } from "date-fns";
import { getAdditionalInfo } from "./tmdb";
import {
  getAllShortLists,
  updateShortlistSelectionStatus,
  updateShortlistState,
} from "./shortlist";
import type { User } from "@prisma/client";
import { countByKey, sample, shuffle } from "./utils";

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
      user: true,
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

export async function simulateRaffle(repetitions: number) {
  const shortlists = await getAllShortLists();
  const resultArr = Array<ChosenMovie>();
  let lastChosen: User;
  for (let i = 0; i < repetitions; i++) {
    const movies = shortlists
      .map((shortlist) => {
        if (i >15 && shortlist.user.id === lastChosen?.id) {
          return {
            user: shortlist.user,
            shortlistId: shortlist.id,
            movie: shortlist.movies[0],
          };
        }
        if (shortlist.movies.length < 3) {
          let movie = shortlist.movies[0];
          return [
            {
              user: shortlist.user,
              shortlistId: shortlist.id,
              movie: { ...movie },
            },
            {
              user: shortlist.user,
              shortlistId: shortlist.id,
              movie: { ...movie },
            },
            {
              user: shortlist.user,
              shortlistId: shortlist.id,
              movie: { ...movie },
            },
          ];
        }
        return shortlist.movies.map((movie) =>
          Object.assign(
            {},
            {
              user: shortlist.user,
              shortlistId: shortlist.id,
              movie: movie,
            }
          )
        );
      })
      .flat();
    let shuffledMovies = shuffle(movies);

    let chosen = sample(shuffledMovies, true);
    resultArr.push(chosen);
    lastChosen = chosen?.user!;
  }
 
  let moviesByUser = countByKey(resultArr, (movie: ChosenMovie) => {
    return movie?.user?.name!;
  });

  let dataObj = {
    label: "Movies by user",
    data: []
  } as UserChartData
  
  for (let user in moviesByUser) {
    dataObj.data.push({
      user: user,
      movies: moviesByUser[user]
    })
  }
  return dataObj;
}

export async function chooseMovieOfTheWeek() {
  // get an array of all the movies and the user - Array<{user, movie}>
  const shortlists = await getAllShortLists();
  /*
  const selectionRequired = shortlists.filter((shortlist) =>
    shortlist.requiresSelection && shortlist.participating? true : false
  );

  if (selectionRequired.length > 0) {
    for (let listItem of selectionRequired) {
      if (
        listItem.selectedIndex === undefined ||
        listItem.selectedIndex === null
      ) {
        throw new Error(
          `${listItem.user.name} needs to select a movie to include`
        );
      }
    }
  }
  const notReady = shortlists.filter((shortlist) => !shortlist.isReady && shortlist.participating);
  //const allReady = every(shortlists, (shortlist) => shortlist.isReady)

  if (notReady.length > 0) {
    throw new Error(
      `Not all users are ready: ${notReady
        .map((item) => item.user.name)
        .join(", ")}`
    );
  }*/

  const movies = shortlists
    .map((shortlist) => {
      
      if (shortlist.requiresSelection) {
        return {
          user: shortlist.user,
          shortlistId: shortlist.id,
          movie: shortlist.movies[shortlist.selectedIndex!],
        };
      }
      
      return shortlist.movies.map((movie) =>
        Object.assign(
          {},
          {
            user: shortlist.user,
            shortlistId: shortlist.id,
            movie: movie,
          }
        )
      );
    })
    .flat();
  // shuffle a few times
  let shuffledMovies = shuffle(movies);
  let chosen = sample(shuffledMovies, true);

  let movieObject = await getMovie(chosen?.movie.id!);

  /**
   * For some reason some times including the user in the movie retrieved from db fails
   * so we need to add it manually just in case
   */

  if (!movieObject?.user) {
    movieObject = {
      ...movieObject,
      user: chosen?.user,
    } as MovieOfTheWeek;
  }
 
  // update movie with the date
  // reset selection state for the current week's winner
  // set restrictions to new winner

  await updateChosenMovie(movieObject!, chosen!.user.id);
  
  /*
  for (let item of shortlists) {
    await updateShortlistState(false, item.id);

    const inSelectionRequired = selectionRequired.find(
      (listItem) => listItem.id === item.id
    );
    if (inSelectionRequired) {
      await updateShortlistSelectionStatus(false, item.id);
    }

    if (item.id === chosen?.shortlistId) {
      await updateShortlistSelectionStatus(true, item.id);
    }
  }*/

  return {
    ...movieObject,
    movieOfTheWeek: getNextDate(),
    owner: chosen?.user.name,
  } as MovieOfTheWeek;
}

export async function updateChosenMovie(movie: Movie, userId: string) {
  const nextDate = getNextDate();

  let updatedMovie = await prisma.movie.update({
    where: {
      id: movie.id,
    },
    data: {
      movieOfTheWeek: nextDate,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return updatedMovie;
}

export async function connectChosenMovies(movies: any[]) {
  const users: any = {
    Juhani: "64aec109b56d6dd5a8489cb4",
    Jussi: "64b825e750ebc52d19bc72e7",
    Miika: "648875d9b274755f19862cbf",
    Niko: "64b7c8d13be96d82bde4a930",
  };
  for (let movie of movies) {
    let username = movie.user;

    if (username) {
      // retrieve the movie
      const movieData = await prisma.movie.findUnique({
        where: {
          tmdbId: movie.tmdbId!,
        },
      });
    

      if (!movieData?.userId) {
        let res = await prisma.movie.update({
          where: {
            id: movieData?.id,
          },
          data: {
            user: {
              connect: {
                id: users[username],
              },
            },
          },
        });
      }
    }
  }

  return movies;
}

export async function getStatistics() {
  const movies = await prisma.movie.findMany({
    where: {
      movieOfTheWeek: {
        not: null,
      },
    },
    include: {
      user: true,
    },
  });

  let moviesByUser = countByKey(movies, (movie) => {
    return movie.user?.name!;
  });

  let dataArr = []
  let dataObj = {
    label: "Movies by user",
    data: []
  } as UserChartData
  
  for (let user in moviesByUser) {
    dataObj.data.push({
      user: user,
      movies: moviesByUser[user]
    })
  }
  dataArr.push(dataObj)
  return dataObj;
}

function getNextDate() {
  return set(nextWednesday(new Date()), {
    hours: 18,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
}
