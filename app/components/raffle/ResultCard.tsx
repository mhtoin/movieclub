import Image from "next/image";

export default function ResultCard({ movie }: { movie: Movie }) {
  return (
    <div className="grid grid-rows-6 h-full">
      <div className="row-span-4 flex relative">
        <div className="w-full h-40 absolute bottom-10 right-1/2 translate-x-1/2 flex justify-center items-center">
          <div className="grid grid-cols-12 justify-center items-center w-full h-full">
            <div className="col-span-6 flex flex-col justify-center items-center " />
            <div className="col-span-4 flex flex-col justify-center items-center">
              <h1 className="text-white font-bold text-[34px]">
                {movie.title}
              </h1>
              <p className="text-foreground/50 font-bold text-[24px]">
                {movie.release_date}
              </p>
            </div>
          </div>
        </div>

        <Image
          src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
          alt={movie.title}
          width={2000}
          height={2000}
          className="object-contain"
          quality={100}
        />
      </div>
      <div className="grid grid-cols-3 gap-5 items-center justify-center px-10 row-span-2">
        <div className="flex flex-col col-span-1  h-full relative">
          <div className="flex justify-center items-center absolute -top-2/3 left-0">
            <img
              src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`}
              alt={movie.title}
              width={100}
              height={200}
              className="object-contain w-4/5 rounded-sm"
            />
          </div>
        </div>
        <div className="flex flex-col col-span-2 h-full justify-center items-center">
          <p className="text-foreground/50 text-xlp-5">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}
