/* eslint-disable @next/next/no-img-element */
"use client";

import { useRemoveFromShortlistMutation } from "@/lib/hooks";
import Link from "next/link";
import { useState, useTransition } from "react";
import { updateSelection } from "../actions/actions";

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
  let [isPending, startTransition] = useTransition();
  const [isHovering, setIsHovering] = useState(false);
  const removeMutation = useRemoveFromShortlistMutation();

  return (
    <div
      className={`relative indicator mx-auto border-2 rounded-sm ${
        highlight && "border-green-700 ring-2 ring-green-500"
      } transition ease-in-out delay-50 hover:scale-110 hover:-translate-y-1
      ${
        requiresSelection &&
        "hover:border-green-700 hover:ring-2 hover:ring-green-500"
      } `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={() => setIsHovering(false)}
      onClick={() => {
        if (requiresSelection && index) {
          startTransition(() => {
            updateSelection(index);
          });
        }
      }}
    >
      <div className="indicator-item indicator-end">
        {removeFromShortList && (
          <button
            className="btn btn-circle btn-xs btn-error"
            onClick={() =>
              removeMutation.mutate({ movieId: movie.id!, shortlistId })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      <img
        src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
        alt=""
        width={"150"}
        className={`${isHovering && "opacity-70"}`}
      />
      {isHovering && (
        <button className="btn btn-ghost btn-xs p-0 absolute top-0 left-0 bottom-0 right-0 m-auto">
          <Link
            href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </Link>
        </button>
      )}
    </div>
  );
}
