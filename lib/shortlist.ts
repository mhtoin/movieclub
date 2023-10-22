import prisma from "./prisma";
import { ObjectId, OptionalId } from "mongodb";
import { Prisma } from "@prisma/client";
import { getAdditionalInfo } from "./tmdb";
import { endOfDay, isWednesday, nextWednesday, set } from "date-fns";
import { NextResponse } from "next/server";
import Pusher from "pusher";

export const revalidate = 10;

const pusher = new Pusher({
  appId: process.env.app_id!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.secret!,
  cluster: "eu",
  useTLS: true
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
      user: true
    }
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

    await pusher.trigger("movieclub-shortlist", "shortlist-update", {
      message: `movies`,
      data: {
        userId: updatedShortlist.userId,
        payload: updatedShortlist
      }
      }).catch((err) => {
        throw new Error(err.message)
      }
    );

    return updatedShortlist;
  } catch (e) {
    console.error(e);
  }
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

    await pusher.trigger("movieclub-shortlist", "shortlist-update", {
      message: `movies`,
      data: {
        userId: updatedShortlist.userId,
        payload: updatedShortlist
      }
      }).catch((err) => {
        throw new Error(err.message)
      }
    );
   
    return updatedShortlist;
    //return NextResponse.json({ message: "Deleted succesfully" });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong" }), { status: 500 };
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

export async function updateShortlistState(ready: boolean, shortlistId: string) {
  
  const updated = await prisma.shortlist.update({
    where: {
      id: shortlistId
    },
    data: {
      isReady: ready
    }
  })

  await pusher.trigger("movieclub-shortlist", "shortlist-update", {
    message: `ready`,
    data: {
      userId: updated.userId,
      payload: updated
    }
  }).catch((err) => {
    throw new Error(err.message)
  }
  );
  
  return updated;
}

export async function updateShortlistParticipationState(ready: boolean, shortlistId: string) {
  return await prisma.shortlist.update({
    where: {
      id: shortlistId
    },
    data: {
      participating: ready
    }
  })
}

export async function updateShortlistSelection(index: number, shortlistId: string) {
  const updated = await prisma.shortlist.update({
    where: {
      id: shortlistId
    }, 
    data: {
      selectedIndex: index
    }
  })

  await pusher.trigger("movieclub-shortlist", "shortlist-update", {
    message: `selection`,
    data: {
      userId: updated.userId,
      payload: updated
    }
  }).catch((err) => {
    throw new Error(err.message)
  }
  );
  return updated;
}

export async function updateShortlistSelectionStatus(status: boolean, shortlistId: string) {
  const updated = await prisma.shortlist.update({
    where: {
      id: shortlistId
    }, 
    data: {
      requiresSelection: status,
      selectedIndex: null
    }
  })

  await pusher.trigger("movieclub-shortlist", "shortlist-update", {
    message: `selection`,
    data: {
      userId: updated.userId,
      payload: updated
    }
  }).catch((err) => {
    throw new Error(err.message)
  }
  );
  return updated;
}