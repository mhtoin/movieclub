"use client";

import { addMovie } from "../home/shortlist/edit/actions/actions";
import { useTransition } from "react";
import { useSession, getSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { omit } from "@/lib/utils";

export default function MoviePosterCard({
  movie,
  added,
}: {
  movie: TMDBMovie;
  added: boolean;
}) {
  let [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient()
  return (
    <div className="indicator mx-auto border-2 rounded-md z-30">
      <div className="indicator-item indicator-top indicator-start">
        <button
          className={`btn btn-circle btn-xs hover:bg-amber-500 ${
            added ? "btn-success btn-disabled" : "btn-warning cursor-copy"
          }`}
          onClick={() => {
            const movieObj = { ...omit(movie, ["id"]), tmdbId: movie.id } as Movie;
            console.log('movie object', movieObj)
            startTransition(() => addMovie(movieObj));
            queryClient.invalidateQueries(['shortlist'])
          }}
        >
          {added ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 fill-inherit"
              viewBox="0 0 12 12"
            >
              <path
                fill="currentColor"
                d="M9.765 3.205a.75.75 0 0 1 .03 1.06l-4.25 4.5a.75.75 0 0 1-1.075.015L2.22 6.53a.75.75 0 0 1 1.06-1.06l1.705 1.704l3.72-3.939a.75.75 0 0 1 1.06-.03Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2Z"
              />
            </svg>
          )}
        </button>
      </div>
      <a
        href={`https://www.themoviedb.org/movie/${movie.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
          alt={movie.title}
          width={"150"}
        />
      </a>
    </div>
  );
}
