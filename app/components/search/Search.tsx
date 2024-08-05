"use client";

import { Fragment, Suspense, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import MovieCard from "./MovieCard";
import {
  useGetWatchlistQuery,
  useSearchSuspenseInfiniteQuery,
  useShortlistQuery,
} from "@/lib/hooks";
import FilterBar from "./FilterBar";
import { Button } from "../ui/Button";

export default function Search() {
  const { data: session } = useSession();
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

  const { data: shortlist, status: shortlistStatus } = useShortlistQuery(
    session?.user?.shortlistId
  );
  const { data: watchlist, status: watchlistStatus } = useGetWatchlistQuery(
    session?.user
  );

  const { data, hasNextPage, fetchNextPage } = useSearchSuspenseInfiniteQuery();

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
    <div className="flex flex-col justify-center items-center gap-5 rounded-lg relative z-50 ">
      <FilterBar />
      <Suspense fallback={<div>Loading...</div>}>
        <div className="h-[400px] overflow-y-auto lg:h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 no-scrollbar p-5 bg-background">
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
      </Suspense>
    </div>
  );
}
