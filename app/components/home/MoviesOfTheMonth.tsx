"use client";
import type { MovieOfTheWeek } from "@/types/movie.type";
import MovieGalleryItem from "./MovieGalleryItem";
import { formatISO, nextWednesday } from "date-fns";
import { movieKeys } from "@/lib/movies/movieKeys";
import { getQueryClient } from "@/lib/getQueryClient";
import {
  HydrationBoundary,
  dehydrate,
  useSuspenseQuery,
} from "@tanstack/react-query";

export default async function MoviesOfTheMonth() {
  const { data: movies } = useSuspenseQuery(movieKeys.pastMovies());

  return (
    <>
      {Object.keys(movies).map((month) => {
        const moviesOfTheMonth = movies[month as keyof typeof movies];
        return (
          <div
            className="gallery snap-start min-h-screen shrink-0 listview-section"
            key={month}
          >
            {moviesOfTheMonth.map(async (movie: MovieOfTheWeek) => {
              return <MovieGalleryItem movie={movie} key={movie.id} />;
            })}
          </div>
        );
      })}
    </>
  );
}
