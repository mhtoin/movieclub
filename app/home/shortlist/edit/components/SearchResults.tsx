"use client";

import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import SearchResultCard from "./SearchResultCard";

interface SearchResultsProps {
  searchValue: string;
  shouldFetch: boolean;
  setShouldFetch: Dispatch<SetStateAction<boolean>>;
  slide: number,
  setSlide: Dispatch<SetStateAction<number>>
}
export default function SearchResults({
  searchValue,
  shouldFetch,
  setShouldFetch,
  slide,
  setSlide
}: SearchResultsProps) {
  const searchMovieDb = async () => {
    const pattern = /\(([^)]+)\)/
    let year = searchValue.match(pattern)
    let queryString

    if (year) {
      queryString = `query=${searchValue.split('(')[0].trim()}&include_adult=false&language=en-US&year=${year[1]}`
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
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMzk2NWNiZGIwMzIyZmJmYWYyMDlhNmFhZmYzNzk1MSIsInN1YiI6IjY0N2YyZWVhMTc0OTczMDExODcyYmYzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qyp0kTQZ4-coX7-DVv5I9IPYRBuAw6ic_x1m9U7yTIk",
        },
      }
    );

    setShouldFetch(false);
    return await res.json();
  };

  const { status, data, fetchStatus } = useQuery({
    queryKey: ["movies", searchValue],
    queryFn: searchMovieDb,
    enabled: shouldFetch,
  });

  const handleNext = (event: React.MouseEvent) => {};

  const handlePrevious = (event: React.MouseEvent) => {};

  if (status === "loading") {
    if (fetchStatus !== 'idle') {
      return <div>Loading...</div>;
    }

    return
    
  }

  return (
    <>
    <div className="carousel carousel-center max-w-lg p-4 space-x-4 rounded-box">
      {data.results.map((movie: any, index: number) => {
        return (
          <div
            id={"item" + index}
            key={"carousel-item-" + movie.id}
            className="carousel-item"
          >
            <SearchResultCard key={movie.id} movie={movie} />
            <div className="absolute flex justify-evenly place-items-center transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a
                href={"#item" + slide}
                className={
                  slide > 0 ? "btn btn-circle" : "btn btn-circle btn-disabled"
                }
                onClick={(event: React.MouseEvent) => setSlide(slide - 1)}
              >
                ❮
              </a>
              <a
                href={"#item" + slide}
                className={
                  slide < data.results.length - 1 ? "btn btn-circle" : "btn btn-circle btn-disabled"
                }
                onClick={(event: React.MouseEvent) => setSlide(slide + 1)}
              >
                ❯
              </a>
            </div>
          </div>
        );
      })}
    </div>
  </>
  );
}
