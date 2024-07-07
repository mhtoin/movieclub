"use client";

import { Fragment, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import MovieCard from "./components/MovieCard";
import {
  useGetWatchlistQuery,
  useSearchInfiniteQuery,
  useShortlistQuery,
} from "@/lib/hooks";
import { useFilterStore } from "@/stores/useFilterStore";
import { range } from "@/lib/utils";
import ItemSkeleton from "../components/ItemSkeleton";
import { Button } from "@/app/components/ui/Button";

export default function SearchPage() {
  const searchValue = useFilterStore.use.searchValue();
  const { data: session } = useSession();
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

  const { data: shortlist, status: shortlistStatus } = useShortlistQuery(
    session?.user?.shortlistId
  );
  const { data: watchlist, status: watchlistStatus } = useGetWatchlistQuery(
    session?.user
  );

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSearchInfiniteQuery();

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

  /*
  if (status === "pending" || shortlistStatus === "pending" || (session?.user.accountId && watchlistStatus === "pending")) {
    return (
      <div className="flex flex-col justify-center m-5 p-10 place-items-center">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {range(30).map((index) => {
          return <ItemSkeleton key={index} />
        })}
      </div>
      </div>
    );
  }*/

  const shortlistMovieIds = shortlist
    ? shortlist?.movies?.map((movie: Movie) => movie.tmdbId)
    : [];

  const watchlistMovieIds = watchlist
    ? watchlist?.map((movie: TMDBMovie) => movie.id)
    : [];

  return (
    <div className="flex flex-col justify-center m-5 p-10 place-items-center">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
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
        <Button
          className="max-w-sm m-auto"
          ref={loadMoreButtonRef}
          onClick={() => fetchNextPage()}
        >
          Load More
        </Button>
      )}
    </div>
  );
}
