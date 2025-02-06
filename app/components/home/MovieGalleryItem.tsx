import { MovieOfTheWeek } from "@/types/movie.type";
import Image from "next/image";
import UserPortrait from "../raffle/UserPortrait";
import Link from "next/link";
import { Star, TrendingUp, Users } from "lucide-react";
import CastPortrait from "../raffle/CastPortrait";
import CastPopover from "../raffle/CastPopover";
import { SiThemoviedatabase } from "react-icons/si";
import { FaImdb } from "react-icons/fa";

export default function MovieGalleryItem({ movie }: { movie: MovieOfTheWeek }) {
  const backgroundImage = movie?.images?.backdrops[0];
  return (
    <div className="gallery-item snap-start" key={movie.id}>
      <div className="relative h-full w-full">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50">
          <h1 className="text-white text-2xl font-bold">
            {new Date(movie.watchDate).toLocaleDateString("fi-FI")}
          </h1>
        </div>
        <Image
          src={`https://image.tmdb.org/t/p/original/${backgroundImage?.file_path}`}
          alt={movie.title}
          width={backgroundImage?.width}
          height={backgroundImage?.height}
          className="object-cover h-full w-full absolute inset-0"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top_right,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.8)_20%,rgba(0,0,0,0.7)_100%)]"></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 top-16 grid grid-cols-2 grid-rows-2 gap-4 p-4">
          {/* Top-left cell */}
          <div className="flex items-center justify-center p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-2">
                <UserPortrait user={movie?.user} />
              </div>
              <p className="text-lg max-w-[500px] text-foreground/60">
                {movie?.tagline}
              </p>
              <h1 className="text-5xl font-bold underline">{movie?.title}</h1>
              <div className="flex flex-row gap-2">
                <p className="text-lg max-w-[500px] text-foreground/60">
                  {new Date(movie?.watchDate).toLocaleDateString("fi-FI")}
                </p>
                <span>|</span>
                <span className="text-lg max-w-[500px] text-foreground/60 flex flex-row items-center gap-1">
                  <Star className="w-6 h-6" />
                  {movie?.vote_average.toFixed(1)}
                </span>
                <span>|</span>
                <span className="text-lg max-w-[500px] text-foreground/60 flex flex-row items-center gap-1">
                  <Users className="w-6 h-6" />
                  {movie?.vote_count}
                </span>
                <span>|</span>
                <span className="text-lg max-w-[500px] text-foreground/60 flex flex-row items-center gap-1">
                  <TrendingUp className="w-6 h-6" />
                  {movie?.popularity.toFixed(1)}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                {movie?.watchProviders?.providers?.map((provider) => {
                  return (
                    <Link
                      href={movie?.watchProviders?.link}
                      target="_blank"
                      key={provider.provider_id}
                      className="rounded-md hover:bg-accent/50 transition-all duration-300 border border-accent/50"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                        alt={provider.provider_name}
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top-right cell */}
          <div className="flex items-center justify-start p-4 ">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Cast</h1>
              <div className="flex flex-row gap-2 justify-start items-center">
                {movie?.cast?.slice(0, 6).map((cast) => {
                  return <CastPortrait cast={cast} key={cast.id} />;
                })}
                {movie?.cast && <CastPopover cast={movie?.cast} />}
              </div>
            </div>
          </div>

          {/* Bottom-left cell */}
          <div className="flex items-start justify-center p-4 ">
            <div className="flex flex-col gap-2">
              {movie?.videos?.[0]?.key && (
                <iframe
                  className="w-full aspect-video rounded-md border border-accent/50 lg:h-[400px]"
                  src={`https://www.youtube.com/embed/${movie.videos[0].key}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* Bottom-right cell */}
          <div className="flex items-start justify-start p-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <div className="text-sm bg-background/40 rounded-md px-2 py-1">
                  {movie?.genres?.map((genre) => genre.name).join("/")}
                </div>
                <div className="text-sm bg-background/40 rounded-md px-2 py-1">
                  {movie?.runtime
                    ? `${Math.floor(movie?.runtime / 60)}h ${
                        movie?.runtime % 60
                      }m`
                    : ""}
                </div>
              </div>
              <div className="flex flex-row gap-2 rounded-md w-fit px-2 py-1">
                <Link
                  href={`https://www.themoviedb.org/movie/${movie?.tmdbId}`}
                  target="_blank"
                >
                  <SiThemoviedatabase className="w-6 h-6 hover:text-accent" />
                </Link>
                <Link
                  href={`https://www.imdb.com/title/${movie?.imdbId}`}
                  target="_blank"
                >
                  <FaImdb className="w-6 h-6 hover:text-accent" />
                </Link>
              </div>
              <p className="text-lg max-w-[500px] text-foreground/60">
                {movie?.overview}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
