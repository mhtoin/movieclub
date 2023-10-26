"use client";

import { useState } from "react";
import { MovieDatePicker } from "./MovieDatePicker";

export default function DateView({
  selected, setSelected
}: {
  selected: Date,
  setSelected: (date: Date) => void
}) {
  
  return (
    <div className="flex flex-row items-center border bg-transparent rounded-md justify-between max-w-[300px]">
      <MovieDatePicker selected={new Date(selected)} setSelected={setSelected} />
    </div>
  );
}
