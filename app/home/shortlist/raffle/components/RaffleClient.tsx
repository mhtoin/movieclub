"use client";

import { Prisma, Shortlist, User } from "@prisma/client";
import ShortListItem from "../../edit/components/ShortListItem";
import { startTransition } from "react";
import { startRaffle } from "../../edit/actions/actions";

export default function RaffleClient({
  allShortlists,
}: (Shortlist & {
  user: User;
  movies: Movie[];
})[]) {
  return (
    <>
      <button
        className="btn"
        onClick={() => startTransition(() => startRaffle(allShortlists))}
      >
        Start raffle
      </button>
      {allShortlists.map((shortlist) => {
        return (
          <>
            <h1 key={shortlist.id + "-title"} className="text-xl m-5">
              {shortlist.user.name}
            </h1>
            <div
              key={shortlist.id + "-container"}
              className="flex flex-row gap-5 w-2/3 sm:w-auto"
            >
              {shortlist.movies.map((movie) => {
                return (
                  <ShortListItem
                    key={shortlist.id + movie.id}
                    movie={movie}
                    shortlistId={shortlist.id}
                  />
                );
              })}
            </div>
          </>
        );
      })}
    </>
  );
}
