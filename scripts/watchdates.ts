import { formatISO } from "date-fns";
import prisma from "../lib/prisma";

async function migrateDates() {
  const movies = await prisma.movie.findMany({
    where: {
      movieOfTheWeek: {
        not: null,
      },
    },
  });

  movies.forEach(async (movie) => {
    const movieOfTheWeek = movie.movieOfTheWeek;

    if (!movieOfTheWeek) {
      return;
    }
    const formatted = formatISO(movieOfTheWeek, { representation: "date" });

    await prisma.movie.update({
      where: {
        id: movie.id,
      },
      data: {
        watchDate: formatted,
      },
    });
  });
}

migrateDates();
