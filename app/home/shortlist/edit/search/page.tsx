"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import ShortlistContainer from "./components/ShortlistContainer";
import MovieCard from "./components/MovieCard";
import { useGetWatchlistQuery, useShortlistQuery } from "@/lib/hooks";
import { useFilterStore } from "@/stores/useFilterStore";
import Filters from "./components/Filters";
import { range } from "@/lib/utils";
import ItemSkeleton from "../components/ItemSkeleton";

export const revalidate = 5;

const fetchMovies = async (page: number, searchValue: string) => {
  const searchQuery = searchValue
    ? searchValue + `&page=${page}`
    : `discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=FI`;
  const initialSearch = await fetch(
    `https://api.themoviedb.org/3/${searchQuery}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
      },
    }
  );
  return initialSearch.json();
};

export default function SearchPage() {
  const searchValue = useFilterStore.use.searchValue();
  const { data: session } = useSession();
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

  const { data: shortlist, status: shortlistStatus } = useShortlistQuery(
    session?.user?.shortlistId
  );
  const { data: watchlist } = useGetWatchlistQuery(session?.user);

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      [searchValue],
      ({ pageParam = 1 }) => fetchMovies(pageParam, searchValue),
      {
        getNextPageParam: (lastPage) => {
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

  if (status === "loading" || shortlistStatus === "loading" || !shortlist || !watchlist) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {range(10).map((index) => {
          return <ItemSkeleton key={index} />
        })}
      </div>
    );
  }

  const shortlistMovieIds = shortlist
    ? shortlist?.movies?.map((movie: Movie) => movie.tmdbId)
    : [];

  const watchlistMovieIds = watchlist
    ? watchlist?.map((movie: TMDBMovie) => movie.id)
    : [];
  return (
    <div className="flex flex-col p-10 ">
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 p-10">
        {data
          ? data?.pages?.map((page) => (
              <Fragment key={page.page}>
                {page.results.map((movie: TMDBMovie) => {
                  return (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      added={shortlistMovieIds?.includes(movie.id)}
                      inWatchlist={watchlistMovieIds?.includes(movie.id)}
                    />
                  );
                })}
              </Fragment>
            ))
          : []}
    </div>
    {hasNextPage && (
        <button className="btn max-w-sm m-auto" ref={loadMoreButtonRef} onClick={() => fetchNextPage()}>
          Load More
        </button>
      )}
    </div>
  );
}
