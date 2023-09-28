/* eslint-disable @next/next/no-img-element */
"use client";

import { useRemoveFromShortlist } from "@/lib/hooks";
import { useTransition } from "react";

interface SearchResultCardProps {
  movie: Movie;
  shortlistId: string,
  removeFromShortList?: boolean
  highlight?: boolean;

}

export default function ShortListItem({
  movie,
  shortlistId,
  removeFromShortList,
  highlight,
}: SearchResultCardProps) {
  let [isPending, startTransition] = useTransition();
  const removeMutation = useRemoveFromShortlist();


  return (
    <div className={`indicator mx-auto border-2 rounded-sm ${highlight && 'border-green-700 ring-2 ring-green-500'}`}>
      <div className="indicator-item indicator-end">
        {removeFromShortList && <button
          className="btn btn-circle btn-xs btn-error"
          onClick={() => removeMutation.mutate({movieId: movie.id!, shortlistId})}
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
        </button>}
      </div>
      <a
        href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
          alt=""
          width={"150"}
        />
      </a>
    </div>

  );
}
