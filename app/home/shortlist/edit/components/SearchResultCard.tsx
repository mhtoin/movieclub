'use client'

import { useMutation } from "@tanstack/react-query";

interface SearchResultCardProps {
  movie: object;
}

export default function SearchResultCard({ movie }: SearchResultCardProps) {
  const mutation = useMutation({
    mutationFn: async (movie: object) => {
      try {
        const res = await fetch('http://localhost:3001/api/shortlist', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(movie),
        })
      } catch (error) {
        console.log('something went wrong!')

      }
    }
  })

  const handleChoose = () => {
    mutation.mutate(movie)
  }
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
          <button className="btn btn-secondary" onClick={() => mutation.mutate(movie)}>Choose</button>
        </div>
      </div>
    </div>
  );
}
