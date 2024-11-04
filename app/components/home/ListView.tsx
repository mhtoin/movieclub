"use client";

import { format, formatISO, nextWednesday } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { movieKeys } from "lib/movies/movieKeys";
import PosterCard from "./PosterCard";
import { sortByISODate } from "@/lib/utils";
import DateSelect from "./DateSelect";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ListView() {
  const nextMovieDate = formatISO(nextWednesday(new Date()), {
    representation: "date",
  });
  const nextMovieMonth = nextMovieDate.split("-").slice(0, 2).join("-");
  const [selectedDate, setSelectedDate] = useState<string | null>(
    nextMovieDate.split("-").slice(0, 2).join("-")
  );

  const { data, status } = useQuery(movieKeys.next(nextMovieDate));
  const router = useRouter();

  const dates = Object.keys(data || {}).map((date) => ({
    date: date,
    label: format(new Date(date), "MMMM"),
  }));

  const nextMovie = data?.[nextMovieMonth]?.[0];
  const isScrolling = useRef(false);

  const handleDateChange = (date: string) => {
    isScrolling.current = true;
    setSelectedDate(date);
    router.push(`#${date}`);

    setTimeout(() => {
      isScrolling.current = false;
    }, 1000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first entry that is intersecting
        if (isScrolling.current) return;
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          const date = visibleEntry.target.id;
          if (date !== selectedDate) {
            setSelectedDate(date);
          }
        }
      },
      {
        root: null, // Use viewport as root
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "-45% 0px -45% 0px", // Creates a band in the middle of the viewport
      }
    );

    // Observe all date container elements
    const elements = document.querySelectorAll('[id^="20"]');
    console.log(elements);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selectedDate, dates]);
  return (
    <div className="flex flex-col gap-4 overflow-hidden max-h-screen overscroll-none">
      <div className="flex justify-center">
        <DateSelect
          dates={dates}
          setSelectedDate={handleDateChange}
          selectedDate={selectedDate || ""}
        />
      </div>

      <div className="flex flex-col gap-10 md:p-10 max-h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
        {nextMovie && (
          <div
            key={nextMovie.id}
            className="flex flex-col gap-4 relative snap-start scroll-mb-20 px-2 md:px-20"
            id={nextMovieMonth}
          >
            <div className="flex items-center justify-center snap-start">
              <div
                className="flex flex-col items-center justify-center h-full gap-2"
                key={nextMovie.id}
                id={nextMovie.id}
              >
                <h1 className="text-lg md:text-2xl font-bold">
                  {new Date(nextMovie.watchDate).toLocaleDateString("fi-FI")}
                </h1>
                <PosterCard movie={nextMovie} key={nextMovie?.id} />
              </div>
            </div>
          </div>
        )}
        {data &&
          Object.keys(data).map((date, index) => {
            const movies: MovieOfTheWeek[] =
              index % 2 === 0
                ? data[date as keyof typeof data]
                : data[date as keyof typeof data].toReversed();
            const month = format(new Date(date), "MMMM");

            if (
              data[date as keyof typeof data].length === 1 &&
              nextMovieMonth === date
            )
              return null;

            return (
              <div
                key={index}
                className="flex flex-col gap-4 relative snap-start scroll-mb-20"
                id={date}
              >
                <h2 className="upright absolute top-1/2 left-0 -translate-y-1/2 text-2xl font-bold leading-none hidden md:block">
                  {month}
                </h2>
                <div className="grid grid-cols-2 gap-5 md:gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 px-5 md:px-20 snap-start">
                  {movies.map((movie: MovieOfTheWeek) => {
                    if (movie.watchDate === nextMovie?.watchDate) return null;
                    return (
                      <div
                        className="flex flex-col items-center justify-center h-full gap-2"
                        key={movie.id}
                        id={movie.id}
                      >
                        <h1 className="text-lg md:text-2xl font-bold">
                          {new Date(movie.watchDate).toLocaleDateString(
                            "fi-FI"
                          )}
                        </h1>
                        <PosterCard movie={movie} key={movie?.id} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
