"use client";
import { movieKeys } from "@/lib/movies/movieKeys";
import { sortByISODate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { formatISO, nextWednesday } from "date-fns";
import { Star, TrendingUp, Users } from "lucide-react";
import Image from "next/image";

export default function CurrentMoviePoster() {
  const nextMovieDate = formatISO(nextWednesday(new Date()), {
    representation: "date",
  });
  const currentDate = formatISO(new Date(), {
    representation: "date",
  });
  const nextMovieMonth = nextMovieDate.split("-").slice(0, 2).join("-");
  const currentMonth = currentDate.split("-").slice(0, 2).join("-");
  const { data, status } = useQuery(movieKeys.next(nextMovieDate));
  const nextMovie = data?.[nextMovieMonth]?.[0];
  const mostRecentMonth = Object.keys(data || {}).sort((a, b) =>
    sortByISODate(a, b, "desc")
  )[0];

  const mostRecentMovie: MovieOfTheWeek = data?.[mostRecentMonth]?.[0];
  console.log("nextMovie", mostRecentMovie);
  return (
    <div className="w-screen h-screen border flex items-center justify-center relative snap-start">
      <div className="relative w-full h-full">
        <Image
          src={`https://image.tmdb.org/t/p/original/${mostRecentMovie?.backdrop_path}`}
          alt={mostRecentMovie?.title}
          className="object-cover absolute inset-0"
          quality={100}
          priority
          fill
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_50%,rgba(0,0,0,0)_100%)]"></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 top-16 grid grid-cols-2 grid-rows-2 gap-4 p-4">
          {/* Top-left cell */}
          <div className="flex items-center justify-center p-4">
            <div className="flex flex-col gap-2">
              <p className="text-lg max-w-[500px] text-foreground/60">
                {mostRecentMovie?.tagline}
              </p>
              <h1 className="text-5xl font-bold underline">
                {mostRecentMovie?.title}
              </h1>
              <div className="flex flex-row gap-2">
                <p className="text-lg max-w-[500px] text-foreground/60">
                  {new Date(mostRecentMovie?.watchDate).toLocaleDateString(
                    "fi-FI"
                  )}
                </p>
                <span>|</span>
                <span className="text-lg max-w-[500px] text-foreground/60 flex flex-row items-center gap-1">
                  <Star className="w-6 h-6" />
                  {mostRecentMovie?.vote_average.toFixed(1)}
                </span>
                <span>|</span>
                <span className="text-lg max-w-[500px] text-foreground/60 flex flex-row items-center gap-1">
                  <Users className="w-6 h-6" />
                  {mostRecentMovie?.vote_count}
                </span>
                <span>|</span>
                <span className="text-lg max-w-[500px] text-foreground/60 flex flex-row items-center gap-1">
                  <TrendingUp className="w-6 h-6" />
                  {mostRecentMovie?.popularity.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Top-right cell */}
          <div className="flex items-start justify-end p-4 ">
            {/* Add your content here */}
          </div>

          {/* Bottom-left cell */}
          <div className="flex items-end justify-start p-4 ">
            {/* Add your content here */}
          </div>

          {/* Bottom-right cell */}
          <div className="flex items-start justify-start p-4">
            {/* Add your content here */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <div className="text-sm bg-background/40 rounded-md px-2 py-1">
                  {mostRecentMovie?.genres
                    ?.map((genre) => genre.name)
                    .join("/")}
                </div>
                <div className="text-sm bg-background/40 rounded-md px-2 py-1">
                  {mostRecentMovie?.runtime
                    ? `${Math.floor(mostRecentMovie?.runtime / 60)}h ${
                        mostRecentMovie?.runtime % 60
                      }m`
                    : ""}
                </div>
              </div>
              <p className="text-lg max-w-[500px] text-foreground/60">
                {mostRecentMovie?.overview}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
