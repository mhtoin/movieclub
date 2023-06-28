"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import SearchResultGrid from "./components/SearchResultGrid";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import MoviePosterCard from "@/app/components/MoviePosterCard";

async function getInitialData() {
  const initialSearch = await fetch(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&watch_region=FI&with_watch_providers=8",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.moviedbtoken}`,
      },
    }
  );
  return initialSearch.json();
}

const fetchMovies = async (page: number, searchValue: string) => {
  const searchQuery = searchValue
    ? searchValue
    : `include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=FI&with_watch_providers=8`;
  const initialSearch = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${searchQuery}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.moviedbtoken}`,
      },
    }
  );
  return initialSearch.json();
};

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const loadMoreButtonRef = useRef();

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ["movies"],
      ({ pageParam = 1 }) => fetchMovies(pageParam, searchValue),
      {
        getNextPageParam: (lastPage) => {
          console.log("getnext", lastPage);
          const { page, total_pages: totalPages } = lastPage;
          return page < totalPages ? page + 1 : undefined;
        },
      }
    );

  useEffect(() => {
    if (!hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver((entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      })
    );
    const el = loadMoreButtonRef && loadMoreButtonRef.current;
    if (!el) {
      return;
    }

    observer.observe(el);

    return () => {
        observer.unobserve(el);
      };
  }, [loadMoreButtonRef.current, hasNextPage]);

  if (status === "loading") {
    return (
      <div className="flex flex-row items-center">
        <div>Loading...</div>
      </div>
    );
  }

  console.log("initial", data);
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="input"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-center gap-10">
        {data?.pages.map((page) => (
          <Fragment key={page.page}>
            {page.results.map((movie: TMDBMovie) => {
              return (
                <MoviePosterCard key={movie.id} movie={movie} added={false} />
              );
            })}
          </Fragment>
        ))}
      </div>
      <button ref={loadMoreButtonRef} onClick={() => fetchNextPage()}>
        Load More
      </button>
    </div>
  );
}
