"use client";

import { useState, useTransition } from "react";
import { useMutation } from "@tanstack/react-query";
import RaffleResultModal from "./RaffleResultModal";
import RaffleResultCard from "./RaffleResultCard";
import { Icon } from "@iconify/react";

const initiateRaffle = async () => {
  let res = await fetch("/api/raffle", {
    method: "POST",
  });

  return await res.json();
};

export function RaffleClient() {
  let [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [chosenMovie, setChosenMovie] = useState<MovieOfTheWeek>();
  const [notification, setNotification] = useState();
  //const allShortlists = await getAllShortLists()
  const raffle = useMutation({
    mutationFn: initiateRaffle,
    onSuccess: (data) => {
      if (data.ok) {
      } else {
        if (data.message) {
          setNotification(data.message);
        }
        setOpen(true);
      }
    },
  });

  return (
    <div className="fixed z-90 bottom-10 right-8">
      <button
        className="btn btn-active btn-circle btn-lg"
        onClick={() => {
          raffle.mutate();
        }}
      >
       <Icon icon="game-icons:card-random" style={{ fontSize: '46px' }}/>
      </button>
      <RaffleResultModal open={open}>
        {chosenMovie ? (
          <RaffleResultCard chosenMovie={chosenMovie!} />
        ) : (
          <div>
            <p>{notification}</p>
          </div>
        )}
        <div className="modal-action">
          {/* closes the modal */}
          <button className="btn btn-primary" onClick={() => setOpen(!open)}>
            Close
          </button>
        </div>
      </RaffleResultModal>
    </div>
  );
}
