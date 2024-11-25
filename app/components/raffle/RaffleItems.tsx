import { motion } from "framer-motion";
import Image from "next/image";

export default function RaffleItems({
  shuffledMovies,
  currentIndex,
  started,
}: {
  shuffledMovies: MovieWithUser[];
  currentIndex: number;
  started: boolean;
}): JSX.Element {
  return (
    <>
      <h3 className="text-lg font-bold">Movies</h3>
      <motion.div
        layout
        className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-7 p-5"
      >
        {shuffledMovies.map((movie, index) => {
          return (
            <div
              key={`movie-${movie?.id}-${movie.user?.id}`}
              className="relative"
              id={`movie-${movie?.id}-${movie.user?.id}`}
            >
              <Image
                src={`https://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
                key={`movie-${movie?.id}-${movie.user?.id}`}
                alt=""
                width={"150"}
                height={"200"}
                priority={false}
                loading="lazy"
                sizes="(max-width: 768px) 20vw, (max-width: 1200px) 20vw, 33vw"
                className={`w-[150px] h-auto 2xl:w-[150px] animate-slideLeftAndFade transition-all duration-300 ease-in-out rounded-md ${
                  index === currentIndex && started
                    ? "saturate-100 scale-110"
                    : "saturate-0 scale-100"
                }`}
              />
            </div>
          );
        })}
      </motion.div>
    </>
  );
}
