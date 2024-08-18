"use client";
import {
  useShortlistQuery,
  useGetWatchlistQuery,
  useSearchSuspenseInfiniteQuery,
} from "@/lib/hooks";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useRef } from "react";
import { Button } from "@/app/components/ui/Button";
import MovieCard from "./MovieCard";

export default function Results() {
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
  }, [hasNextPage, fetchNextPage]);

  const shortlistMovieIds = shortlist
    ? shortlist?.movies?.map((movie: Movie) => movie.tmdbId)
    : [];

  const watchlistMovieIds = watchlist
    ? watchlist?.map((movie: TMDBMovie) => movie.id)
    : [];
  return (
    <div className="h-[calc(100vh-210px)] w-full max-w-screen-xl mx-auto overflow-y-auto lg:h-full grid grid-flow-row-dense grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 no-scrollbar p-2 bg-background">
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
          variant="outline"
          size="lg"
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
