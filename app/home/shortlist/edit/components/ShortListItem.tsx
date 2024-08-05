/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/app/components/ui/Button";
import {
  useRemoveFromShortlistMutation,
  useUpdateSelectionMutation,
} from "@/lib/hooks";
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
  const [isHovering, setIsHovering] = useState(false);
  const removeMutation = useRemoveFromShortlistMutation();
  const selectionMutation = useUpdateSelectionMutation();

  return (
    <div
      className={`relative indicator mx-auto rounded-md ${
        highlight && "border-green-700 shadow-[inset_2px_2px_10px_0px_#2f855a]"
      } transition ease-in-out delay-50 hover:scale-110 hover:-translate-y-1
      ${requiresSelection && "hover:shadow-[inset_0px_0px_10px_0px_#2f855a]"} `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
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
      <img
        src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
        alt=""
        width={"150"}
        className={`${
          isHovering && "opacity-50"
        } rounded-md relative gradient-mask-b-80 object-fill object-center w-[120px] h-auto 2xl:w-[150px]`}
      />
      {(selectionMutation.isPending || removeMutation.isPending) && (
        <span className="loading loading-spinner loading-lg absolute top-0 left-0 bottom-0 right-0 m-auto z-40"></span>
      )}
      {isHovering && (
        <Button
          size={"icon"}
          variant={"ghost"}
          className="p-0 absolute top-0 left-0 bottom-0 right-0 m-auto"
        >
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
        </Button>
      )}
      {removeFromShortList && (
        <Button
          size={"icon"}
          variant={"ghost"}
          className="absolute top-0 right-0 p-0"
          onClick={(event) => {
            removeMutation.mutate({ movieId: movie.id!, shortlistId });
            event.stopPropagation();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      )}
    </div>
  );
}
