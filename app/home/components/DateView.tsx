"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarPopover } from "./CalendarPopover";
import { MovieDatePicker } from "./MovieDatePicker";
import { useQuery } from "@tanstack/react-query";
import { getAllMoviesOfTheWeek } from "@/lib/utils";

export default function DateView({
  movieOfTheWeek,
}: {
  movieOfTheWeek: MovieOfTheWeek;
}) {
  const [selected, setSelected] = useState<Date>(
    new Date(movieOfTheWeek?.movieOfTheWeek || "")
  );
  const [open, setOpen] = useState<boolean>(false);
  const { data } = useQuery({
    queryKey: ["movieOfTheWeek"],
    queryFn: async () => getAllMoviesOfTheWeek(),
  });
  console.log('data', data)
  return (
    <div className="flex flex-row items-center border bg-transparent rounded-md justify-between max-w-[300px]">
      <MovieDatePicker selected={selected} setSelected={setSelected} />
    </div>
  );
}
