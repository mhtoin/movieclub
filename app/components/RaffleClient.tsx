"use client";

import { useState, useTransition } from "react";
import { useMutation } from "@tanstack/react-query";
import RaffleResultModal from "../home/components/RaffleResultModal";
import RaffleResultCard from "../home/components/RaffleResultCard";
import { Icon } from "@iconify/react";
import RaffleDialog from "./RaffleDialog";
import { useRaffleStore } from "@/stores/useRaffleStore";
import { useRaffleMutation } from "@/lib/hooks";

const initiateRaffle = async () => {
  let res = await fetch("/api/raffle", {
    method: "POST",
  });

  return await res.json();
};

export function RaffleClient() {
  const setIsLoading = useRaffleStore.use.setIsLoading();
  const setIsOpen = useRaffleStore.use.setIsOpen();
  //const allShortlists = await getAllShortLists()
  const raffle = useRaffleMutation();

  return (
    <div className="fixed z-50 bottom-20 right-8 sm:bottom-10">
       <button
          className="btn btn-active btn-circle btn-lg"
          onClick={() => {
            //console.log("clicked");
            setIsLoading(true);
            setIsOpen(true);
            raffle.mutate();
          }}
        >
          <Icon icon="game-icons:card-random" style={{ fontSize: "46px" }} />
        </button>
    </div>
  );
}
