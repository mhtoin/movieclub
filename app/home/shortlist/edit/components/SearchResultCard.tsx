'use client'
import { useTransition } from "react";
import { addMovie } from "../actions/actions";
import { start } from "repl";

interface SearchResultCardProps {
  movie: {
    backdrop_path: string
    poster_path: string
  };
}

export default function SearchResultCard({ movie }: SearchResultCardProps) {
  let [isPending, startTransition] = useTransition()
 
  return (
    <div className="card w-96 h-80 bg-base-100 shadow-2xl image-full">
      <figure>
        <img
          src={movie.backdrop_path ? `http://image.tmdb.org/t/p/original${movie['backdrop_path']}` : `http://image.tmdb.org/t/p/original/${movie['poster_path']}`}
          alt=""
          width={384}
          height={384}
        />
      </figure>
      <div className="card-body overflow-scroll">
        <h2 className="card-title">{`${movie.title} ${movie.original_title !== movie.title ? `(${movie.original_title})` : ''}`}</h2>
        <h3>{movie.release_date}</h3>
        <p className="text-xs overflow-scroll">{movie.overview}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-secondary" onClick={() => startTransition(() => addMovie(movie))}>
            Choose</button>
        </div>
      </div>
    </div>
  );
}
