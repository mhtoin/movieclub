/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/app/components/ui/Button";
import {
  useAddToShortlistMutation,
  useAddToWatchlistMutation,
  useRemoveFromShortlistMutation,
  useUpdateSelectionMutation,
  useValidateSession,
} from "@/lib/hooks";
import {
  BookmarkMinus,
  BookmarkPlus,
  ListPlus,
  ListX,
  Star,
  TicketCheck,
  TicketPlus,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { FaImdb } from "react-icons/fa";
import { SiThemoviedatabase } from "react-icons/si";

interface SearchResultCardProps {
  movie: Movie;
  shortlistId: string;
  removeFromShortList?: boolean;
  highlight?: boolean;
  requiresSelection?: boolean;
  index?: number;
  showActions?: boolean;
}

export default function ShortListItem({
  movie,
  shortlistId,
  removeFromShortList,
  highlight,
  requiresSelection,
  index,
  showActions,
}: SearchResultCardProps) {
  const removeMutation = useRemoveFromShortlistMutation();
  const selectionMutation = useUpdateSelectionMutation();
  const watchlistMutation = useAddToWatchlistMutation();
  const addMutation = useAddToShortlistMutation();
  const { data: user } = useValidateSession();

  return (
    <div
      className={`moviecard group ${
        highlight ? "border-accent border-b-4 transition-all duration-700" : ""
      }`}
    >
      {showActions &&
        requiresSelection &&
        shortlistId === user?.shortlistId && (
          <div className="opacity-0 group-hover:opacity-80 backdrop-blur-md transition-opacity duration-300 absolute top-0 left-0 z-10 fill-accent stroke-foreground flex flex-col items-center justify-center gap-2 bg-card rounded-br-lg rounded-tl-lg p-2">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              onClick={() => {
                selectionMutation.mutate({
                  shortlistId: user?.shortlistId || "",
                  selectedIndex: index!,
                });
              }}
              isLoading={selectionMutation.isPending}
            >
              {highlight ? (
                <TicketCheck className="w-5 h-5" />
              ) : (
                <TicketPlus className="w-5 h-5" />
              )}
            </Button>
          </div>
        )}
      {showActions && (
        <div className="opacity-0 group-hover:opacity-80 backdrop-blur-md border border-border/50 transition-opacity duration-300 absolute top-0 right-0 z-10 fill-accent stroke-foreground flex flex-col items-center justify-center gap-2 bg-card rounded-bl-lg rounded-tr-lg p-2">
          {removeFromShortList ? (
            <Button
              variant={"ghost"}
              size={"iconXs"}
              onClick={() => {
                removeMutation.mutate({
                  shortlistId: user?.shortlistId || "",
                  movieId: movie.id!,
                });
              }}
              isLoading={removeMutation.isPending}
            >
              <ListX />
            </Button>
          ) : (
            <Button
              variant={"ghost"}
              size={"iconXs"}
              onClick={() => {
                addMutation.mutate({
                  shortlistId: user?.shortlistId || "",
                  movie: movie,
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
                movieId: movie.tmdbId,
              });
            }}
            isLoading={watchlistMutation.isPending}
          >
            {true ? <BookmarkMinus /> : <BookmarkPlus />}
          </Button>
        </div>
      )}
      <img
        src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
        alt=""
        width={"150"}
        className={`primary-img w-[150px] h-auto 2xl:w-[150px]`}
      />
      {(selectionMutation.isPending || removeMutation.isPending) && (
        <span className="loading loading-spinner loading-lg absolute top-0 left-0 bottom-0 right-0 m-auto z-40"></span>
      )}
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
                href={`https://www.themoviedb.org/movie/${movie?.tmdbId}`}
                target="_blank"
              >
                <Button variant="ghost" size="icon">
                  <SiThemoviedatabase className="w-6 h-6" />
                </Button>
              </Link>
              <Link href={`https://www.imdb.com/title/${movie?.id}`}>
                <Button variant="ghost" size="icon">
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