"use client";

import { format, formatISO, nextWednesday } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { movieKeys } from "lib/movies/movieKeys";
import PosterCard from "./PosterCard";
import { sortByISODate } from "@/lib/utils";
import DateSelect from "./DateSelect";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PosterCarousel from "./PosterCarousel";

export default function ListView() {
  const nextMovieDate = formatISO(nextWednesday(new Date()), {
    representation: "date",
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(
    nextMovieDate.split("-").slice(0, 2).join("-")
  );

  const { data, status } = useQuery(movieKeys.next(nextMovieDate));
  const router = useRouter();

  const dates = Object.keys(data || {}).map((date) => ({
    date: date,
    label: format(new Date(date), "MMMM"),
  }));

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    router.push(`#${date}`);
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden max-h-screen overscroll-none">
      <div className="flex justify-center">
        <DateSelect
          dates={dates}
          setSelectedDate={handleDateChange}
          selectedDate={selectedDate || ""}
        />
      </div>
      <PosterCarousel />
    </div>
  );
}
