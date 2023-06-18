"use client";

import ShortListItem from "../../edit/components/ShortListItem";
import { useTransition } from "react";
import { startRaffle } from "../../edit/actions/actions";
import { getAllShortLists } from "@/lib/shortlist";



export function RaffleClient({ allShortlists }: { allShortlists: any}) {
  let [isPending, startTransition] = useTransition()
  //const allShortlists = await getAllShortLists()

  return (
    <>
      <button
        className="btn"
        onClick={() => startTransition(() => startRaffle(allShortlists))}
      >
        Start raffle
      </button>
      {allShortlists.map((shortlist: any) => {
        return (
          <>
            <h1 key={shortlist.id + "-title"} className="text-xl m-5">
              {shortlist.user.name}
            </h1>
            <div
              key={shortlist.id + "-container"}
              className="flex flex-row gap-5 w-2/3 sm:w-auto"
            >
              {shortlist.movies.map((movie: Movie) => {
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
