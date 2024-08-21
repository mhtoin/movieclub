/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/app/components/ui/Button";
import {
  useAddToShortlistMutation,
  useRemoveFromShortlistMutation,
  useUpdateSelectionMutation,
} from "@/lib/hooks";
import { ExternalLink, ListCheck, ListPlus, ListX } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useTransition } from "react";

interface SearchResultCardProps {
  movie: Movie;
  shortlistId: string;
  removeFromShortList?: boolean;
  highlight?: boolean;
  requiresSelection?: boolean;
  index?: number;
}

export default function ShortListItem({
  movie,
  shortlistId,
  removeFromShortList,
  highlight,
  requiresSelection,
  index,
}: SearchResultCardProps) {
  const removeMutation = useRemoveFromShortlistMutation();
  const selectionMutation = useUpdateSelectionMutation();
  const addMutation = useAddToShortlistMutation();
  const { data: session } = useSession();

  return (
    <div
      className={`card ${
        highlight ? "border-accent border-b-4 transition-all duration-700" : ""
      }`}
    >
      <img
        src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
        alt=""
        width={"150"}
        className={`primary-img w-[150px] h-auto 2xl:w-[150px]`}
      />
      {/*<img
        src={`http://image.tmdb.org/t/p/original/${movie["backdrop_path"]}`}
        alt=""
        width={"150"}
        height={"220"}
        className={`w-auto h-[220px] 2xl:w-auto 2xl:h-[220px] secondary-img`}
      />*/}
      {(selectionMutation.isPending || removeMutation.isPending) && (
        <span className="loading loading-spinner loading-lg absolute top-0 left-0 bottom-0 right-0 m-auto z-40"></span>
      )}
      <div className="card__content">
        <div className="card__title-container">
          <h2 className="card__title line-clamp-2">{movie.title}</h2>
        </div>
        <div className="card__description">
          <div className="description-actions">
            <div className="flex flex-col items-center">
              <span className="text-xs">Add</span>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={(event) => {
                  addMutation.mutate({
                    shortlistId: session?.user?.shortlistId,
                    movie,
                  });
                  event.stopPropagation();
                }}
              >
                <ListPlus />
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs">Select</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(event) => {
                  if (requiresSelection && index !== undefined) {
                    selectionMutation.mutate({
                      shortlistId,
                      selectedIndex: index,
                    });
                    event.stopPropagation();
                  }
                }}
              >
                <ListCheck />
              </Button>
            </div>
            {removeFromShortList ? (
              <div className="flex flex-col items-center">
                <span className="text-xs">Remove</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(event) => {
                    removeMutation.mutate({ shortlistId, movieId: movie.id! });
                    event.stopPropagation();
                  }}
                >
                  <ListX />
                </Button>
              </div>
            ) : null}
          </div>
          <div className="description-links">
            <div className="flex flex-col items-center">
              <span className="text-xs">TMDb</span>
              <Link
                href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
                target="_blank"
              >
                <Button variant="ghost" size="icon">
                  <ExternalLink />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
