import Image from "next/image";

export default function ResultCard({ movie }: { movie: Movie }) {
  return (
    <div className="grid grid-rows-2 h-full w-full">
      <div className="flex border h-full w-full">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="w-full h-full object-cover"
          quality={100}
        />
      </div>
      <div className="flex border h-full w-full"></div>
    </div>
  );
}
