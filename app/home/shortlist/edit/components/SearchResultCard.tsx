import Image from "next/image";

interface SearchResultCardProps {
  movie: object;
}

export default function SearchResultCard({ movie }: SearchResultCardProps) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl image-full">
      <figure>
        <img
          src={movie.backdrop_path ? `http://image.tmdb.org/t/p/original${movie['backdrop_path']}` : `http://image.tmdb.org/t/p/original/${movie['poster_path']}`}
          alt=""
          width={384}
          height={384}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{`${movie.title} ${movie.original_title !== movie.title ? `(${movie.original_title})` : ''}`}</h2>
        <h3>{movie.release_date}</h3>
        <p className="text-xs">{movie.overview}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Choose</button>
        </div>
      </div>
    </div>
  );
}
