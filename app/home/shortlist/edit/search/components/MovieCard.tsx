"use client";

import { useSession } from "next-auth/react";
import { omit } from "@/lib/utils";
import {
  useAddToShortlistMutation,
  useAddToWatchlistMutation,
} from "@/lib/hooks";
import { useState } from "react";
import BookmarkButton from "./BookmarkButton";
import AddButton from "./AddButton";
import Link from "next/link";
import MovieCardButton from "./MovieCardButton";
import CheckMark from "./CheckMark";
import { set } from "date-fns";
import { Button } from "@/app/components/ui/Button";

export default function MovieCard({
  movie,
  added,
  inWatchlist,
}: {
  movie: TMDBMovie;
  added: boolean;
  inWatchlist: boolean;
}) {
  const { data: session } = useSession();
  const [isHovering, setIsHovering] = useState(false);
  const addMutation = useAddToShortlistMutation();
  const watchlistMutation = useAddToWatchlistMutation();
  return (
    <div
      className="relative indicator mx-auto rounded-md transition ease-in-out delay-50 hover:scale-110 hover:-translate-y-1"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
      //onClick={() => setIsHovering(!isHovering)}
    >
      <img
        src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
        alt={movie.title}
        width={"150"}
        className={`${
          isHovering && "opacity-50"
        } object-fill object-center rounded-md w-[120px] h-auto 2xl:w-[150px] relative -z-10 gradient-mask-b-80`}
      />
      {addMutation.isPending && (
        <span className="loading loading-spinner loading-lg absolute top-0 left-0 bottom-0 right-0 m-auto z-40"></span>
      )}
      <MovieCardButton
        icon={added ? <CheckMark /> : <AddButton isFilled={false} />}
        hoverIcon={added ? <CheckMark /> : <AddButton isFilled={true} />}
        mutationFn={
          added
            ? () => void 0
            : () => {
                addMutation.mutate({
                  shortlistId: session?.user?.shortlistId,
                  movie: {
                    ...omit(movie, ["id"]),
                    tmdbId: movie.id,
                  } as Movie,
                });
              }
        }
      />
      <MovieCardButton
        icon={<BookmarkButton isFilled={inWatchlist} />}
        hoverIcon={<BookmarkButton isFilled={true} />}
        mutationFn={
          added
            ? () => void 0
            : () => {
                watchlistMutation.mutate({
                  movieId: movie.id,
                });
              }
        }
      />
      {isHovering && (
        <Link
          href={`https://www.themoviedb.org/movie/${movie.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant={"ghost"}
            size={"icon"}
            className="absolute top-0 left-0 bottom-0 right-0 m-auto"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 p-0 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </Button>
        </Link>
      )}
    </div>
  );
}
