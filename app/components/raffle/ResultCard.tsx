import { useMovieQuery } from "@/lib/hooks";
import {
  Star,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaImdb } from "react-icons/fa";
import { SiThemoviedatabase } from "react-icons/si";
import { SiYoutube } from "react-icons/si";
import CastPortrait from "./CastPortrait";
import CastPopover from "./CastPopover";
import UserPortrait from "./UserPortrait";
import TrailerLink from "./TrailerLink";
import { CastMember } from "@/types/tmdb.type";

export default function ResultCard({ movie }: { movie: MovieWithUser }) {
  const { data: movieData, status } = useMovieQuery(
    movie.tmdbId,
    movie ? true : false
  );

  if (status === "pending") return <Loader2 className="animate-spin" />;

  const watchproviders = movieData?.["watch/providers"]
    ? movieData["watch/providers"].results["FI"]
    : null;
  const backdrops = movieData?.images?.backdrops.filter(
    (backdrop) => backdrop.iso_639_1 === "en"
  );
  const posters = movieData?.images?.posters.filter(
    (poster) => poster.iso_639_1 === "en"
  );

  const randomBackdrop = backdrops
    ? backdrops[Math.floor(Math.random() * backdrops.length)]
    : null;

  console.log("backdrop", randomBackdrop);

  return (
    <div className="grid grid-rows-6 h-full">
      <div className="row-span-4 flex relative ">
        <div className="w-full h-40 absolute bottom-10 right-1/2 translate-x-1/2 flex justify-center items-center">
          <div className="grid grid-cols-12 justify-center items-center w-full h-full">
            <div className="col-span-6 flex flex-col justify-center items-center" />
            <div className="col-span-6 flex flex-col justify-center gap-2">
              <h1 className="text-white font-bold text-[24px] bg-accent/50 rounded-md px-1 w-fit">
                {movie.title}
              </h1>

              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 bg-accent/50 rounded-md p-2 w-fit">
                  <span className="text-sm flex flex-row items-center gap-1">
                    <Star className="w-6 h-6" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-sm flex flex-row items-center gap-1">
                    <Users className="w-6 h-6" />
                    {movie.vote_count}
                  </span>
                  <span className="text-sm flex flex-row items-center gap-1">
                    <TrendingUp className="w-6 h-6" />
                    {movie.popularity.toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-row gap-2 bg-accent/50 rounded-md p-2 w-fit">
                  <span className="text-sm flex flex-row items-center gap-1">
                    <Clock className="w-6 h-6" />
                    {`${
                      movieData?.runtime
                        ? Math.floor(movieData?.runtime / 60)
                        : 0
                    } h ${
                      movieData?.runtime ? movieData?.runtime % 60 : 0
                    } min`}
                  </span>
                  <span className="text-sm flex flex-row items-center gap-1">
                    <Calendar className="w-6 h-6" />
                    {new Date(movie.release_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-row gap-2 rounded-md w-fit">
                  <Link
                    href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
                    target="_blank"
                    className="bg-accent/50 rounded-md p-2"
                  >
                    <SiThemoviedatabase className="w-6 h-6 " />
                  </Link>
                  <Link
                    href={`https://www.imdb.com/title/${movieData?.imdb_id}`}
                    target="_blank"
                    className="bg-accent/50 rounded-md p-2"
                  >
                    <FaImdb className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Image
          src={`https://image.tmdb.org/t/p/original${randomBackdrop?.file_path}`}
          alt={movie.title}
          width={randomBackdrop?.width}
          height={randomBackdrop?.height}
          className={`object-cover aspect-[${randomBackdrop?.aspect_ratio}]`}
          quality={100}
          priority
        />
      </div>
      <div className="grid grid-cols-3 gap-5 items-center justify-center px-10 row-span-2 ">
        <div className="flex flex-col col-span-1 h-full relative ">
          <div className="flex flex-col justify-center items-center absolute -top-[85%] left-0 gap-5 py-2">
            <Image
              src={`https://image.tmdb.org/t/p/original${posters?.[0]?.file_path}`}
              alt={movie.title}
              width={posters?.[0]?.width}
              height={posters?.[0]?.height}
              className="object-contain w-4/5 rounded-sm aspect-[${posters?.[0]?.aspect_ratio}]"
              priority
            />
            <div className="flex flex-row flex-wrap gap-2 justify-center items-center max-w-40">
              {watchproviders?.flatrate?.map((provider) => {
                return (
                  <img
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    width={50}
                    height={50}
                    className="rounded-sm"
                    key={provider.provider_id}
                  />
                );
              })}
            </div>
            <div className="flex flex-row flex-wrap gap-2 justify-center items-center max-w-40">
              {movieData?.genres?.map((genre) => {
                return (
                  <div
                    className="text-foreground/50 text-sm bg-foreground/10 rounded-md px-2 py-1"
                    key={genre.id}
                  >
                    {genre.name}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-row flex-wrap gap-2 justify-center items-center max-w-40">
              {movieData?.videos?.results?.slice(0, 3).map((video) => {
                return <TrailerLink video={video} key={video.id} />;
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col col-span-2 h-full pt-10 gap-2">
          <span className="text-foreground/50 text-md font-bold italic">
            {movieData?.tagline}
          </span>
          <div className="flex flex-row gap-2 justify-start items-center">
            {movieData?.credits?.cast?.slice(0, 6).map((cast) => {
              return <CastPortrait cast={cast as CastMember} key={cast.id} />;
            })}
            {movieData?.credits?.cast && (
              <CastPopover cast={movieData?.credits?.cast as CastMember[]} />
            )}
          </div>
          <p className="text-foreground/50 ">{movie.overview}</p>
          <div className="flex flex-row gap-2">
            <div className="flex flex-row gap-2">
              <UserPortrait user={movie?.user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
