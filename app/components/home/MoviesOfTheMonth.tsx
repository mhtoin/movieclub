"use client";
import type { MovieOfTheWeek } from "@/types/movie.type";
import MovieGalleryItem from "./MovieGalleryItem";
import { format } from "date-fns";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getMoviesOfTheMonth } from "@/lib/movies/queries";
import { Loader2Icon } from "lucide-react";
export default function MoviesOfTheMonth() {
  const router = useRouter();
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const currentMonth =
    useSearchParams().get("month") || format(new Date(), "yyyy-MM");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["pastMovies"],
      queryFn: ({ pageParam }) => getMoviesOfTheMonth(pageParam),
      initialPageParam: currentMonth,
      getNextPageParam: (lastPage) => {
        if (!lastPage?.month) return undefined;
        const { month } = lastPage;
        // Get the next month from the current month. The shape is YYYY-MM, so we need to add one month
        const dateParts = month.split("-");
        const monthNumber = parseInt(dateParts[1]);
        const yearNumber = parseInt(dateParts[0]);
        const nextMonthNumber =
          monthNumber > 1 ? monthNumber - 1 : monthNumber === 1 ? 12 : 1;
        const nextYearNumber = monthNumber === 1 ? yearNumber - 1 : yearNumber;
        const nextMonthString =
          nextMonthNumber < 10 ? `0${nextMonthNumber}` : nextMonthNumber;
        const nextMonth = `${nextYearNumber}-${nextMonthString}`;

        return nextMonth;
      },
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "1000px 0px", // Increased buffer to 1000px for earlier detection
        threshold: 0, // Trigger immediately when any part of sentinel becomes visible
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const month = entry.target.getAttribute("data-month");
            if (month) {
              const params = new URLSearchParams(window.location.search);
              params.set("month", month);
              window.history.replaceState({}, "", `${pathname}?${params}`);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("[data-month]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [data.pages, router]);

  return (
    <>
      {data?.pages.map((page) => (
        <div
          key={page.month}
          data-month={page.month}
          className="gallery snap-start min-h-screen shrink-0 listview-section relative"
        >
          {page.movies.map((movie: MovieOfTheWeek) => (
            <MovieGalleryItem key={movie.id} movie={movie} />
          ))}
          {isFetchingNextPage && (
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loader2Icon className="animate-spin" />
            </div>
          )}
        </div>
      ))}
      <div ref={sentinelRef} className="h-6 w-full" />
    </>
  );
}
