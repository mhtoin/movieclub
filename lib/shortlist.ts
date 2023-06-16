import prisma from "./prisma";
import { ObjectId, OptionalId } from "mongodb";
import { Prisma } from "@prisma/client";
import { omit } from "ramda";

export const revalidate = 10;

export async function getShortList(id: string) {
  const shortlist = await prisma.shortlist.findFirst({
    where: {
      userId: id,
    },
    include: {
      movies: true,
    },
  });

  console.log("shortlist with id", id, shortlist);
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

export async function addMovieToShortlist(
  movie: Movie,
  userId: string,
  shortlistId: string
) {
  try {
    // check if user has shortlist, create if absent
    console.log("trying to add movie", movie, "for ", userId);

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
