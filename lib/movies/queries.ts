/**
 * Queries
 */

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

export const searchKeywords = async (value: string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/keyword?query=${value}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
      },
    }
  );
  return await res.json();
};

export const getKeyWord = async (id: string) => {
  const res = await fetch(`https://api.themoviedb.org/3/keyword/${id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
    },
  });
  return await res.json();
};

export const getMovie = async (id: number) => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
    },
  });
  return (await res.json()) as TMDBMovie;
};
