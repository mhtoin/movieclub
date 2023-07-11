import prisma from "./prisma";
import { ObjectId, OptionalId } from "mongodb";
import { Prisma } from "@prisma/client";
import { getAdditionalInfo } from "./tmdb";
import { endOfDay, isWednesday, nextWednesday, set } from "date-fns";

export const revalidate = 10;

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

  console.log("looking for date", now);
  console.log("next one", nextMovieDate);

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
      user: true
    }
  });

  const details = movie ? await getAdditionalInfo(movie?.tmdbId) : {};
  console.log('movie before', movie)
  if (movie) {
    const movieObject = Object.assign(
      movie,
      details
    ) as unknown as MovieOfTheWeek;
    console.log('movie object', movieObject)
    return movieObject;
  }
}

export async function getShortList(id: string) {
  const shortlist = await prisma.shortlist.findFirst({
    where: {
      userId: id,
    },
    include: {
      movies: true,
    },
  });

  return shortlist as Prisma.ShortlistInclude;
}

export async function getAllShortLists() {
  return await prisma.shortlist.findMany({
    include: {
      movies: true,
      user: true,
    },
  });
}

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
  try {
    // check if user has shortlist, create if absent

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

    return updatedShortlist;
  } catch (e) {
    console.error(e);
  }
}

export async function removeMovieFromShortlist(
  id: string,
  shortlistId: string
) {
  console.log("deleting", id, shortlistId);
  try {
    const movie = await prisma.shortlist.update({
      where: {
        id: shortlistId,
      },
      data: {
        movies: {
          disconnect: [{ id: id }],
        },
      },
    });
    console.log("deleted", movie);
    return movie;
    //return NextResponse.json({ message: "Deleted succesfully" });
  } catch (e) {
    console.log(e);
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

export async function updateShortlistState(ready: boolean, shortlistId: string) {
  return await prisma.shortlist.update({
    where: {
      id: shortlistId
    },
    data: {
      isReady: ready
    }
  })
}

export async function updateShortlistSelection(index: number, shortlistId: string) {
  return await prisma.shortlist.update({
    where: {
      id: shortlistId
    }, 
    data: {
      selectedIndex: index
    }
  })
}

export async function updateShortlistSelectionStatus(status: boolean, shortlistId: string) {
  return await prisma.shortlist.update({
    where: {
      id: shortlistId
    }, 
    data: {
      requiresSelection: status,
      selectedIndex: null
    }
  })
}