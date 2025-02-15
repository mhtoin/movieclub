"use client";
import type { MovieOfTheWeek } from "@/types/movie.type";
import Image from "next/image";
import UserPortrait from "../raffle/UserPortrait";
import Link from "next/link";
import {
  Star,
  TrendingUp,
  Users,
  ChevronsLeftRight,
  X,
  Clapperboard,
} from "lucide-react";
import CastPortrait from "../raffle/CastPortrait";
import CastPopover from "../raffle/CastPopover";
import { SiThemoviedatabase } from "react-icons/si";
import { FaImdb } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
export default function MovieGalleryItem({ movie }: { movie: MovieOfTheWeek }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const _router = useRouter();
  const backgroundImage = movie?.images?.backdrops[0]?.file_path
    ? `https://image.tmdb.org/t/p/original/${movie?.images?.backdrops[0]?.file_path}`
    : `https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`;

  useEffect(() => {
    if (isExpanded) {
      document.body.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setIsExpanded(false);
        }
      });
    }
    return () => {
      document.body.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setIsExpanded(false);
        }
      });
    };
  }, [isExpanded]);

  const handleHover = () => {
    const params = new URLSearchParams(window.location.search);
    const dateParts = movie.watchDate.split("-");
    const day = dateParts[2];
    params.set("date", day);
    window.history.replaceState({}, "", `${pathname}?${params}`);
  };

  return (
    <div
      className="gallery-item @container group"
      key={movie.id}
      data-expanded={isExpanded}
      onMouseEnter={() => handleHover()}
    >
      <div className="relative w-full h-full">
        <Image
          src={backgroundImage}
          alt={movie?.title}
          className="object-cover absolute inset-0"
          quality={50}
          fill
          placeholder="blur"
          blurDataURL={movie?.images?.backdrops[0]?.blurDataUrl}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top_right,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.8)_20%,rgba(0,0,0,0.7)_100%)]" />
        {!isExpanded && (
          <div className="absolute inset-0 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 z-50 bg-[radial-gradient(transparent_0%,var(--primary)_80%,var(--primary)_100%)] opacity-10 blur-xl" />
            <Button
              variant="ghost"
              size="iconLg"
              onClick={() => setIsExpanded(!isExpanded)}
              className="z-50"
              tabIndex={isExpanded ? -1 : 0}
            >
              <ChevronsLeftRight className="w-8 h-8" />
            </Button>
          </div>
        )}
        {isExpanded &&
          createPortal(
            <div className="fixed top-5 right-5 z-[101]">
              <Button
                variant="ghost"
                size="iconLg"
                onClick={() => setIsExpanded(!isExpanded)}
                className="z-[101]"
                tabIndex={isExpanded ? -1 : 0}
              >
                <X className="w-8 h-8" />
              </Button>
            </div>,
            document.body
          )}

        {/* Grid Overlay */}
        <div
          className="absolute inset-0 top-12 flex flex-col gap-2 md:gap-4 p-4 items-center justify-center w-full h-full data-[expanded=false]:top-0 md:data-[expanded=false]:top-12"
          data-expanded={isExpanded}
        >
          <div className="flex flex-col @4xl:flex-row @4xl:gap-4 w-full h-full justify-evenly @4xl:items-center ">
            <div className="flex items-center justify-start @4xl:justify-center p-4 w-full @4xl:w-1/2 h-full">
              <div className="flex flex-col gap-2 md:gap-4 justify-center">
                <p
                  className="text-sm @4xl:text-xl max-w-[500px] text-foreground/60 data-[expanded=true]:text-lg md:data-[expanded=false]:text-lg"
                  data-expanded={isExpanded}
                >
                  {movie?.tagline}
                </p>
                <h1
                  className="text-lg @4xl:text-5xl font-bold underline data-[expanded=true]:text-3xl md:data-[expanded=false]:text-3xl"
                  data-expanded={isExpanded}
                >
                  {movie?.title}
                </h1>
                <div className="flex flex-row gap-2 ">
                  <UserPortrait
                    user={movie?.user}
                    className="w-6 h-6 md:w-10 md:h-10"
                  />
                </div>
                <div className="flex flex-row gap-2 flex-wrap items-center">
                  <p className="text-sm @4xl:text-lg max-w-[500px] text-foreground/60">
                    {new Date(movie?.watchDate).toLocaleDateString("fi-FI")}
                  </p>
                  <span>|</span>
                  <span className="text-sm @4xl:text-lg max-w-[500px] text-foreground/60 flex flex-row items-center gap-1">
                    <Star className="w-4 h-4 @4xl:w-6 @4xl:h-6" />
                    {movie?.vote_average.toFixed(1)}
                  </span>
                  <span>|</span>
                  <span className="text-sm @4xl:text-lg max-w-[500px] text-foreground/60 flex flex-row items-center gap-1">
                    <Users className="w-4 h-4 @4xl:w-6 @4xl:h-6" />
                    {movie?.vote_count}
                  </span>
                  <span>|</span>
                  <span className="text-sm @4xl:text-lg max-w-[500px] text-foreground/60 flex flex-row items-center gap-1">
                    <TrendingUp className="w-4 h-4 @4xl:w-6 @4xl:h-6" />
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
                          className="rounded-md w-8 h-8 @4xl:w-10 @4xl:h-10 md:data-[expanded=false]:w-10 md:data-[expanded=false]:h-10 data-[expanded=true]:w-8 data-[expanded=true]:h-8 data-[expanded=false]:w-6 data-[expanded=false]:h-6"
                          data-expanded={isExpanded}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top-right cell */}
            <div
              className="hidden @4xl:flex items-center justify-start p-4 @4xl:w-1/2 h-full data-[expanded=true]:flex md:data-[expanded=false]:flex "
              data-expanded={isExpanded}
            >
              <div className="flex flex-col gap-2">
                <h1 className="text-xl @4xl:text-2xl font-bold">Cast</h1>
                <div className="flex flex-row gap-2 justify-start items-center">
                  {movie?.cast?.slice(0, 6).map((cast) => {
                    return <CastPortrait cast={cast} key={cast.id} />;
                  })}
                  {movie?.cast && <CastPopover cast={movie?.cast} />}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-left cell */}
          <div className="flex flex-col @4xl:flex-row gap-12 w-full h-full @4xl:justify-evenly ">
            <div className="hidden @4xl:flex items-start justify-center p-4 w-full @4xl:w-1/2 h-full">
              <div className="flex flex-col gap-2 w-full h-full items-center">
                {movie?.videos?.[0]?.key && (
                  <iframe
                    className="aspect-video rounded-lg h-1/2"
                    loading="lazy"
                    src={`https://www.youtube.com/embed/${movie.videos[0].key}`}
                    title="YouTube video player"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
            {/* Video link for expanded mobile state */}
            {isExpanded && (
              <div className="flex md:hidden flex-col items-start px-4 justify-center gap-2">
                <h2 className="text-lg font-bold">Trailer</h2>
                <Link
                  href={`https://www.youtube.com/embed/${movie?.videos?.[0]?.key}`}
                  target="_blank"
                  className="hover:text-accent transition-all duration-300 border border-accent/50 rounded-md p-2 bg-accent/10"
                >
                  <Clapperboard className="w-8 h-8" />
                </Link>
              </div>
            )}

            {/* Bottom-right cell */}
            <div
              className="hidden @4xl:flex items-start justify-start px-4 w-full @4xl:w-1/2 data-[expanded=true]:flex md:data-[expanded=false]:flex"
              data-expanded={isExpanded}
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <div className="text-sm bg-background/40 rounded-md px-0 md:px-2 py-1">
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
                <div className="flex flex-row gap-2 rounded-md w-fit px-0 md:px-2 md:py-1">
                  <Link
                    href={`https://www.themoviedb.org/movie/${movie?.tmdbId}`}
                    target="_blank"
                  >
                    <SiThemoviedatabase className="w-4 h-4 @4xl:w-6 @4xl:h-6 hover:text-accent" />
                  </Link>
                  <Link
                    href={`https://www.imdb.com/title/${movie?.imdbId}`}
                    target="_blank"
                  >
                    <FaImdb className="w-4 h-4 @4xl:w-6 @4xl:h-6 hover:text-accent" />
                  </Link>
                </div>
                <p className="text-sm @4xl:text-lg max-w-[500px] text-foreground/60 px-0 md:px-2 max-h-[100px] overflow-y-auto md:max-h-none">
                  {movie?.overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
