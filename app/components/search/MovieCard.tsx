"use client";

import { useSession } from "next-auth/react";
import { omit } from "@/lib/utils";
import {
  useAddToShortlistMutation,
  useAddToWatchlistMutation,
  useMovieQuery,
  useRemoveFromShortlistMutation,
  useUpdateSelectionMutation,
} from "@/lib/hooks";
import { useState } from "react";
import BookmarkButton from "./BookmarkButton";
import AddButton from "./AddButton";
import Link from "next/link";
import MovieCardButton from "./MovieCardButton";
import CheckMark from "./CheckMark";
import { Button } from "../ui/Button";
import {
  ListPlus,
  ListCheck,
  ListX,
  ExternalLink,
  BookmarkPlus,
  BookmarkMinus,
  Bookmark,
  Star,
  Users,
  TrendingUp,
} from "lucide-react";
import { SiThemoviedatabase, SiImdb } from "react-icons/si";
import { FaImdb } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { getMovie } from "@/lib/movies/queries";

export default function MovieCard({
  movie,
  added,
  inWatchlist,
  showActions,
}: {
  movie: TMDBMovie;
  added?: boolean;
  inWatchlist?: boolean;
  showActions?: boolean;
}) {
  const queryClient = useQueryClient();
  const [isHovering, setIsHovering] = useState(false);
  const watchlistMutation = useAddToWatchlistMutation();
  const addMutation = useAddToShortlistMutation();
  const removeMutation = useRemoveFromShortlistMutation();
  const { data: movieData, status } = useMovieQuery(movie.id, isHovering);
  const { data: session } = useSession();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["movie", movie.id],
      queryFn: () => getMovie(movie.id),
      staleTime: 1000 * 60 * 60 * 24,
      gcTime: 1000 * 60 * 60 * 24,
    });
  };

  return (
    <div
      className={`moviecard group`}
      onMouseEnter={() => {
        prefetch();
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
    >
      {showActions && (
        <div className="opacity-0 group-hover:opacity-80  backdrop-blur-md border border-border/50 transition-opacity duration-300 absolute top-0 right-0 z-10 fill-accent stroke-foreground flex flex-col items-center justify-center gap-2 bg-card rounded-bl-lg rounded-tr-lg p-2">
          {added ? (
            <Button
              variant={"ghost"}
              size={"iconXs"}
              onClick={() => {
                removeMutation.mutate({
                  shortlistId: session?.user?.shortlistId,
                  movieId: movie.id,
                });
              }}
              isLoading={addMutation.isPending}
            >
              <ListCheck />
            </Button>
          ) : (
            <Button
              variant={"ghost"}
              size={"iconXs"}
              onClick={() => {
                addMutation.mutate({
                  shortlistId: session?.user?.shortlistId,
                  movie: {
                    ...omit(movie, ["id"]),
                    tmdbId: movie.id,
                    imdbId: movieData?.imdb_id,
                  } as Movie,
                });
              }}
              isLoading={addMutation.isPending}
            >
              <ListPlus />
            </Button>
          )}
          <Button
            variant="ghost"
            size="iconXs"
            onClick={() => {
              watchlistMutation.mutate({
                movieId: movie.id,
              });
            }}
            isLoading={watchlistMutation.isPending}
          >
            {inWatchlist ? <BookmarkMinus /> : <BookmarkPlus />}
          </Button>
        </div>
      )}

      <img
        src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
        alt=""
        width={"150"}
        className={`w-[150px] h-auto 2xl:w-[150px]`}
      />
      <div className="info">
        <h1 className="title line-clamp-2">{movie.title}</h1>
        <div className="flex flex-row gap-2 flex-wrap">
          <span className="text-xs flex flex-row items-center gap-1">
            <Star className="w-4 h-4" />
            {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-xs flex flex-row items-center gap-1">
            <Users className="w-4 h-4" />
            {movie.vote_count}
          </span>
          <span className="text-xs flex flex-row items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {movie.popularity.toFixed(1)}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div className="flex flex-row gap-2"></div>
          <div className="description-links">
            <div className="flex flex-row items-center gap-2">
              <Link
                href={`https://www.themoviedb.org/movie/${movie.id}`}
                target="_blank"
              >
                <Button variant="ghost" size="icon">
                  <SiThemoviedatabase className="w-6 h-6" />
                </Button>
              </Link>
              <Link href={`https://www.imdb.com/title/${movieData?.imdb_id}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  isLoading={status === "pending"}
                >
                  <FaImdb className="w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
