"use client";

import { useSearchParams } from "next/navigation";

export default function WatchDate() {
  const params = useSearchParams();
  const date = params.get("month");
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
  const [month, year] = formattedDate.split(" ");

  const monthLetters = month.split("");
  const yearLetters = year.split("");

  return (
    <div className="hidden md:flex flex-row p-2 rounded-md bg-background">
      {monthLetters.map((letter, index) => (
        <span
          className="bg-background border p-2 h-10 w-10 flex items-center justify-center first:rounded-l-md "
          key={`${letter}-${index}`}
        >
          {letter.toUpperCase()}
        </span>
      ))}
      <span className="bg-background border p-2 h-10 w-10 flex items-center justify-center"></span>
      {yearLetters.map((letter, index) => (
        <span
          className="bg-background border  p-2 h-10 w-10 flex items-center justify-center last:rounded-r-md"
          key={`${letter}-${index}`}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
