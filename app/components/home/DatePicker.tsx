"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, isWednesday, set } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/Button";
import { Calendar } from "@/app/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/Popover";
import { useQuery } from "@tanstack/react-query";
import { getAllMoviesOfTheWeek } from "@/lib/movies/queries";

export function DatePicker({
  selected,
  setSelected,
}: {
  selected: Date;
  setSelected: any;
}) {
  const [date, setDate] = React.useState<Date>();
  const { data } = useQuery({
    queryKey: ["moviesOfTheWeek"],
    queryFn: getAllMoviesOfTheWeek,
  });

  const isDateMovieDate = (date: Date) => {
    return !isWednesday(date);
  };

  const highletedDates = data
    ? Object.values<MovieOfTheWeek>(data).map(
        (movie: MovieOfTheWeek) => new Date(movie.movieOfTheWeek!)
      )
    : [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          disabled={isDateMovieDate}
          onSelect={(date) => {
            setSelected(date);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
