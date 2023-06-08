'use client'

import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import SearchResultCard from "./SearchResultCard";

interface SearchResultsProps {
  searchValue: string;
  shouldFetch: boolean;
  setShouldFetch: Dispatch<SetStateAction<boolean>>;
}
export default function SearchResults({
  searchValue,
  shouldFetch,
  setShouldFetch,
}: SearchResultsProps) {
  const searchMovieDb = async () => {
    const queryString = `query=${searchValue}&include_adult=false&language=en-US`;
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

  const { status, data } = useQuery({
    queryKey: ["movies", searchValue],
    queryFn: searchMovieDb,
    enabled: shouldFetch,
  });

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col items-center border border-white rounded-lg p-5 bg-gray-900 gap-2 overflow-scroll max-h-screen">
        {data.results.map((movie: any) => {
            return (
                <SearchResultCard key={movie.id} movie={movie} />
            )
        })}
    </div>
  )
}
