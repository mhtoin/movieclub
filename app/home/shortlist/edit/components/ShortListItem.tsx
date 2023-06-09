interface SearchResultCardProps {
  movie: object;
}

export default function ShortListItem({ movie }: SearchResultCardProps) {
  return (
    <div className="mx-auto border-2 rounded-md">
      <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
        <img
          src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
          alt=""
          width={"150"}
        />
      </a>
    </div>
  );
}
