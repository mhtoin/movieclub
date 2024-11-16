import { queryOptions } from "@tanstack/react-query";
import { getMoviesOfTheWeek, getMoviesUntil } from "./movies";

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
};
