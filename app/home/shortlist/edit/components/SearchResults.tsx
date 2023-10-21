"use client";

import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import SearchResultCard from "./SearchResultCard";

import 'dotenv/config'
import { omit } from "@/lib/utils";
interface SearchResultsProps {
  searchValue: string;
  shouldFetch: boolean;
  setShouldFetch: Dispatch<SetStateAction<boolean>>;
  slide: number;
  setSlide: Dispatch<SetStateAction<number>>;
}
export default function SearchResults({
  searchValue,
  shouldFetch,
  setShouldFetch,
  slide,
  setSlide,
}: SearchResultsProps) {
  const searchMovieDb = async () => {
    const pattern = /\(([^)]+)\)/;
    let year = searchValue.match(pattern);
    let queryString;

    if (year) {
      queryString = `query=${searchValue
        .split("(")[0]
        .trim()}&include_adult=false&language=en-US&year=${year[1]}`;
    } else {
      queryString = `query=${searchValue}&include_adult=false&language=en-US`;
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?${queryString}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            `Bearer ${process.env.moviedbtoken}`
        },
      }
    );

    setShouldFetch(false);
    const { results }: { results: TMDBMovie[] } = await res.json();
    return results.map((row) => {
      return { ...omit(row, ["id"]), tmdbId: row.id };
    }) as Movie[];
  };

  const { status, data, fetchStatus } = useQuery({
    queryKey: ["movies", searchValue],
    queryFn: searchMovieDb,
    enabled: shouldFetch,
  });

  if (status === "pending") {
    if (fetchStatus !== "idle") {
      return <span className="loading loading-spinner"></span>;
    }
    return <div></div>;
  }

  if (data) {
    return (
      <>
        <a
          href={"#item" + slide}
          className={
            slide > 0 ? "btn btn-circle" : "btn btn-circle btn-disabled"
          }
          onClick={(event: React.MouseEvent) => setSlide(slide - 1)}
        >
          ˄
        </a>
        <div className="carousel carousel-vertical carousel-center h-96 space-y-4 rounded-box">
          {data.map((movie: any, index: number) => {
            return (
              <div
                id={"item" + index}
                key={"carousel-item-" + movie.tmdbId}
                className="carousel-item "
              >
                <SearchResultCard key={movie.tmdbId} movie={movie} />
              </div>
            );
          })}
        </div>
        <a
          href={"#item" + slide}
          className={
            slide < data.length - 1
              ? "btn btn-circle"
              : "btn btn-circle btn-disabled"
          }
          onClick={(event: React.MouseEvent) => setSlide(slide + 1)}
        >
          V
        </a>
      </>
    );
  } else {
    return <div>No results found</div>;
  }
}
