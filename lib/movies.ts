import prisma from "./prisma";
import { ObjectId, OptionalId } from "mongodb";
import { Prisma } from "@prisma/client";
import { getAdditionalInfo } from "./tmdb";
import { endOfDay, isWednesday, nextWednesday, set } from "date-fns";

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
                lte: now
            }
        }
    })

    return movies
}
