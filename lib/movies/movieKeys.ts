import { queryOptions } from "@tanstack/react-query";
import {
  getMoviesOfTheWeek,
  getMoviesOfTheWeekByMonth,
  getMoviesUntil,
} from "./movies";

export const movieKeys = {
  all: () =>
    queryOptions({
      queryKey: ["moviesOfTheWeek"],
      queryFn: () => getMoviesOfTheWeek(),
    }),

  until: (date: Date) =>
    queryOptions({
      queryKey: ["moviesOfTheWeek", date],
      queryFn: () => getMoviesOfTheWeek(),
    }),
  next: (date: string) =>
    queryOptions({
      queryKey: ["moviesOfTheWeek", date],
      queryFn: () => getMoviesUntil(date),
    }),
  pastMovies: () =>
    queryOptions({
      queryKey: ["pastMovies"],
      queryFn: (_month) => getMoviesOfTheWeekByMonth(""),
    }),
};
