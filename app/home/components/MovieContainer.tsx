"use client";
import { getAllMoviesOfTheWeek } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format, isWednesday, nextWednesday, set } from "date-fns";
import { useState } from "react";
import { MovieHero } from "./MovieHero";
import { MovieDatePicker } from "./MovieDatePicker";
import { motion, AnimatePresence } from "framer-motion";

export const MovieContainer = () => {
  const [movieDate, setMovieDate] = useState<Date>(
    isWednesday(new Date()) ? new Date() : nextWednesday(new Date())
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextDate();
    }
    if (isRightSwipe) {
      prevDate();
    }
  };

  const { data, status } = useQuery({
    queryKey: ["movieOfTheWeek"],
    queryFn: getAllMoviesOfTheWeek,
  });

  const movieOfTheWeek = data ? data[format(movieDate, "dd.MM.yyyy")] : null;

  const nextDate = () => {
    setMovieDate((prev) => set(prev, { date: prev.getDate() + 7 }));
  };

  const prevDate = () => {
    setMovieDate((prev) => set(prev, { date: prev.getDate() - 7 }));
  };

  return (
    <div
      className="flex flex-col items-center justify-normal p-10 gap-10"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex flex-col justify-center place-items-center gap-5">
        <h1 className="text-4xl font-bold text-center">
          Welcome to the Movie Club
        </h1>
        <div className="flex flex-row items-center bg-transparent rounded-md justify-between max-w-[300px] group relative">
          <button
            className="btn btn-ghost invisible group-hover:visible group-hover: hover:drop-shadow-[0_35px_35px_rgba(255,255,255,0.35)]"
            onClick={prevDate}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <div className="flex flex-row items-center border bg-transparent rounded-md max-w-[500px] m-1">
            <MovieDatePicker selected={movieDate} setSelected={setMovieDate} />
          </div>

          <button
            className="btn btn-ghost invisible group-hover:visible"
            onClick={nextDate}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
      <MovieHero movieOfTheWeek={movieOfTheWeek} />
      </AnimatePresence>
      {/*<ChosenMovieCard chosenMovie={movieOfTheWeek} />*/}
    </div>
  );
};
