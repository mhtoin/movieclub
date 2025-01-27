"use client";
import { movieKeys } from "@/lib/movies/movieKeys";
import { sortByISODate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { formatISO, nextWednesday } from "date-fns";
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

  const mostRecentMovie = data?.[mostRecentMonth]?.[0];
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
        <div className="absolute inset-0 bg-background/40"></div>
      </div>
      <div className="absolute lg:bottom-1/2 lg:left-1/4 p-5 flex flex-col gap-2">
        <h1 className="text-4xl">{mostRecentMovie?.title}</h1>
        <p className="text-lg max-w-[500px] text-foreground/60">
          {mostRecentMovie?.overview}
        </p>
      </div>
    </div>
  );
}
