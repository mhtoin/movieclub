"use client";

import ShortListItem from "../../edit/components/ShortListItem";
import { useState, useTransition } from "react";
import { startRaffle } from "../../edit/actions/actions";
import { getAllShortLists } from "@/lib/shortlist";
import { useMutation, useQuery } from "@tanstack/react-query";
import RaffleResultModal from "./RaffleResultModal";
import { MovieHero } from "@/app/home/components/MovieHero";
import RaffleResultCard from "./RaffleResultCard";

const initiateRaffle = async () => {
  let res = await fetch("/api/raffle", {
    method: "POST",
  });

  return await res.json();
};

export function RaffleClient({ allShortlists }: { allShortlists: any }) {
  let [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [chosenMovie, setChosenMovie] = useState<MovieOfTheWeek>();
  //const allShortlists = await getAllShortLists()
  const raffle = useMutation({
    mutationFn: initiateRaffle,
    onSuccess: (data) => {
      if (data.ok) {
        console.log("successfully raffled", data);
        setOpen(true);
        setChosenMovie(data.chosenMovie);
      }
    },
  });

  return (
    <>
      <button
        className="btn"
        onClick={() => {
          raffle.mutate();
        }}
      >
        Start raffle
      </button>
      <RaffleResultModal open={open}>
        <RaffleResultCard chosenMovie={chosenMovie!} />
        <div className="modal-action">
          {/* closes the modal */}
          <button className="btn btn-primary" onClick={() => setOpen(!open)}>
            Close
          </button>
        </div>
      </RaffleResultModal>
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
