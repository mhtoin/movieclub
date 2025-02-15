"use client";

import { useSearchParams } from "next/navigation";

export default function WatchDate() {
  const params = useSearchParams();
  const date = params.get("month");
  const day = params.get("date")?.toString();
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
  const dayLetters = day?.split("");

  return (
    <div className="hidden md:flex flex-row p-4 rounded-md bg-background">
      {monthLetters.map((letter, index) => (
        <span className="flip-letter" key={`${letter}-${index}`}>
          <div className="flip-inner">{letter.toUpperCase()}</div>
        </span>
      ))}
      <span className="flip-letter" />

      {dayLetters?.map((letter, index) => (
        <span className="flip-letter" key={`${letter}-${index}`}>
          <div className="flip-inner">{letter}</div>
        </span>
      ))}
      <span className="flip-letter" />
      {yearLetters.map((letter, index) => (
        <span className="flip-letter" key={`${letter}-${index}`}>
          <div className="flip-inner">{letter}</div>
        </span>
      ))}
    </div>
  );
}
