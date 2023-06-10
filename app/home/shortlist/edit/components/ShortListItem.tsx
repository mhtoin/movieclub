/* eslint-disable @next/next/no-img-element */
"use client";

import { removeFromShortList } from "../actions/actions";
import { useTransition } from "react";

interface SearchResultCardProps {
  movie: Movie;
  removeFromShortList: (id: string) => Promise<void>;
}

export default function ShortListItem({
  movie,
  removeFromShortList,
}: SearchResultCardProps) {
  let [isPending, startTransition] = useTransition();

  return (
    <div className="indicator mx-auto border-2 rounded-md">
      <div className="indicator-item indicator-end">
        <button
          className="btn btn-circle btn-xs btn-error"
          onClick={() => startTransition(() => removeFromShortList(movie._id!))}
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
      </div>
      <a
        href={`https://www.themoviedb.org/movie/${movie.id}`}
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
