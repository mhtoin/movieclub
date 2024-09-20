"server only";
import prisma from "./prisma";
import { getAdditionalInfo } from "./tmdb";
import { endOfDay, isWednesday, nextWednesday, set } from "date-fns";
import { NextResponse } from "next/server";
import Pusher from "pusher";
import { getMovie } from "./movies/queries";
import { keyBy, omit } from "./utils";
import { db } from "./db";

export const revalidate = 10;

const pusher = new Pusher({
  appId: process.env.app_id!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.secret!,
  cluster: "eu",
  useTLS: true,
});

export async function getChosenMovie() {
  // set today to 18:00:00 and check if it is a wednesday
  const nextMovieDate = set(nextWednesday(new Date()), {
    hours: 18,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const now = isWednesday(new Date())
    ? set(new Date(), { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 })
    : nextMovieDate;

  const movie = await prisma.movie.findFirst({
    where: {
      OR: [
        {
          movieOfTheWeek: {
            equals: now,
          },
        },
        {
          movieOfTheWeek: {
            equals: nextMovieDate,
          },
        },
      ],
    },
    include: {
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

export async function getShortList(id: string) {
  const shortlist = await prisma.shortlist.findFirst({
    where: {
      id: id,
    },
    include: {
      movies: true,
    },
  });

  return shortlist;
}

export async function getAllShortLists() {
  return await db.shortlist.findMany({
    include: {
      movies: true,
      user: true,
    },
  });
}

export const getAllShortlistsGroupedById =
  async (): Promise<ShortlistsById> => {
    const data = await getAllShortLists();
    const groupedData = keyBy(data, (shortlist: any) => shortlist.id);
    return groupedData;
  };

export async function findOrCreateShortList(userId: string) {
  const shortlist = await prisma.shortlist.upsert({
    where: {
      userId: userId,
    },
    update: {},
    create: {
      userId: userId,
    },
  });

  return shortlist;
}

export async function addMovieToShortlist(movie: Movie, shortlistId: string) {
  // check if user has shortlist, create if absent
  const shortlist = await prisma.shortlist.findFirst({
    where: {
      id: shortlistId,
    },
    include: {
      movies: true,
    },
  });

  if (shortlist && shortlist.movies.length == 3) {
    throw new Error("Only 3 movies allowed, remove to make room");
  }

  const updatedShortlist = await prisma.shortlist.update({
    where: {
      id: shortlistId,
    },
    data: {
      movies: {
        connectOrCreate: {
          where: {
            tmdbId: movie.tmdbId,
          },
          create: movie,
        },
      },
    },
    include: {
      movies: true,
    },
  });

  await pusher
    .trigger("movieclub-shortlist", "shortlist-update", {
      message: `movies`,
      data: {
        userId: updatedShortlist.userId,
        payload: updatedShortlist,
      },
    })
    .catch((err) => {
      throw new Error(err.message);
    });

  return updatedShortlist;
}

export async function removeMovieFromShortlist(
  id: string,
  shortlistId: string
) {
  try {
    const updatedShortlist = await prisma.shortlist.update({
      where: {
        id: shortlistId,
      },
      data: {
        movies: {
          disconnect: [{ id: id }],
        },
      },
      include: {
        movies: true,
      },
    });

    await pusher
      .trigger("movieclub-shortlist", "shortlist-update", {
        message: `movies`,
        data: {
          userId: updatedShortlist.userId,
          payload: updatedShortlist,
        },
      })
      .catch((err) => {
        throw new Error(err.message);
      });

    return updatedShortlist;
    //return NextResponse.json({ message: "Deleted succesfully" });
  } catch (e) {
    return (
      NextResponse.json({ message: "Something went wrong" }), { status: 500 }
    );
  }
}

export async function updateChosenMovie(movie: Movie) {
  /**
   * First update the last week's movie to false
   */
  const nextDate = set(nextWednesday(new Date()), {
    hours: 18,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

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

export async function updateShortlistState(
  ready: boolean,
  shortlistId: string
) {
  const updated = await prisma.shortlist.update({
    where: {
      id: shortlistId,
    },
    data: {
      isReady: ready,
    },
  });

  await pusher
    .trigger("movieclub-shortlist", "shortlist-update", {
      message: `ready`,
      data: {
        userId: updated.userId,
        payload: updated,
      },
    })
    .catch((err) => {
      throw new Error(err.message);
    });

  return updated;
}

export async function updateShortlistParticipationState(
  participating: boolean,
  shortlistId: string
) {
  return await prisma.shortlist.update({
    where: {
      id: shortlistId,
    },
    data: {
      participating: participating,
    },
  });
}

export async function updateShortlistSelection(
  index: number,
  shortlistId: string
) {
  const updated = await prisma.shortlist.update({
    where: {
      id: shortlistId,
    },
    data: {
      selectedIndex: index,
    },
  });

  await pusher
    .trigger("movieclub-shortlist", "shortlist-update", {
      message: `selection`,
      data: {
        userId: updated.userId,
        payload: updated,
      },
    })
    .catch((err) => {
      throw new Error(err.message);
    });
  return updated;
}

export async function updateShortlistSelectionStatus(
  status: boolean,
  shortlistId: string
) {
  const updated = await prisma.shortlist.update({
    where: {
      id: shortlistId,
    },
    data: {
      requiresSelection: status,
      selectedIndex: null,
    },
  });

  await pusher
    .trigger("movieclub-shortlist", "shortlist-update", {
      message: `selection`,
      data: {
        userId: updated.userId,
        payload: updated,
      },
    })
    .catch((err) => {
      throw new Error(err.message);
    });
  return updated;
}

export async function replaceShortlistMovie(
  replacedMovie: Movie,
  replacingWithMovie: Movie,
  shortlistId: string
) {
  // try to fetch the movie from the db to check if it exists
  // if tmdbId is present, it means replacingWithMovie is of type Movie
  // so we can just insert it directly
  console.log("is tmdb movie", replacingWithMovie);
  console.log("replacedMovie", replacedMovie);
  const movie = await getMovie(replacingWithMovie.tmdbId);
  const movieObject = {
    ...omit(replacingWithMovie, ["id"]),
    tmdbId: movie.id,
    imdbId: movie?.imdb_id,
  } as Movie;
  const updated = await prisma.shortlist.update({
    where: {
      id: shortlistId,
    },
    data: {
      movies: {
        disconnect: [{ id: replacedMovie.id }],
        connectOrCreate: {
          where: { tmdbId: replacingWithMovie.tmdbId },
          create: movieObject,
        },
      },
    },
    include: {
      movies: true,
    },
  });

  return updated;
}
