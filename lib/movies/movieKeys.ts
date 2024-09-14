import { queryOptions } from "@tanstack/react-query";
import { getMoviesOfTheWeek, getMoviesUntil } from "./movies";

export const movieKeys = {
  all: () => ["moviesOfTheWeek"],
  until: (date: Date) =>
    queryOptions({
      queryKey: [...movieKeys.all(), date],
      queryFn: () => getMoviesOfTheWeek(),
    }),
  next: (date: string) =>
    queryOptions({
      queryKey: [...movieKeys.all(), date],
      queryFn: () => getMoviesUntil(date),
    }),
};
