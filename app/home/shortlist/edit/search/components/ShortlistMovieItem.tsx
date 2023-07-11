/* eslint-disable @next/next/no-img-element */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";

interface SearchResultCardProps {
  movie: Movie;
  shortlistId: string,
}

interface deleteFromShortlistVars {
    movieId: string
    shortlistId: string
  }
  
  const deleteMovieFromShortlist = async({movieId, shortlistId}: deleteFromShortlistVars) => {
    const res = await fetch(`/api/shortlist/${shortlistId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({movieId: movieId}),
    })
  }

export default function ShortlistMovieItem({
  movie,
  shortlistId,
}: SearchResultCardProps) {
  let [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteMovieFromShortlist,
    onSuccess: () => {
        queryClient.invalidateQueries(['shortlist'])
    }
  })
  console.log('pending', isPending)
  return (
    <div className="indicator mx-auto border-2 rounded-md">
      <div className="indicator-item indicator-end">
        <button
          className="btn btn-circle btn-xs btn-error"
          onClick={() => {
            setIsDeleting(!isDeleting)
            deleteMutation.mutate({movieId: movie.id!, shortlistId: shortlistId})}}
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
      {deleteMutation.isLoading || isDeleting? 
      <div className="w-[150px] h-[210px] flex flex-col items-center justify-center"><span className="loading loading-ring loading-lg"></span></div>
      : <a
        href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
          alt=""
          width={"150"}
        />
      </a>}
    </div>

  );
}
