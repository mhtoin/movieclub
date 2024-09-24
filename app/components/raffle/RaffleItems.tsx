import { motion } from "framer-motion";

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
        className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-7"
      >
        {shuffledMovies.map((movie, index) => {
          return (
            <div key={`movie-${movie?.id}`} className="relative">
              <img
                src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
                key={`movie-${movie?.id}`}
                alt=""
                width={"150"}
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
