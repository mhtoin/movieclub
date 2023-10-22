"use client";
import { PropsWithChildren, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { useRaffleStore } from "@/stores/useRaffleStore";
import { useGetLatestMutationState, usePusher } from "@/lib/hooks";
import RaffleResultCard from "./RaffleResultCard";
import { format } from "date-fns";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const initiateRaffle = async () => {
  let res = await fetch("/api/raffle", {
    method: "POST",
  });

  return await res.json();
};

export default function RaffleDialog({ children }: PropsWithChildren) {
  usePusher('movieclub-raffle', 'result')
  const isOpen = useRaffleStore.use.isOpen();
  const setIsOpen = useRaffleStore.use.setIsOpen();
  /*
  const raffleState = useGetLatestMutationState(["raffle"]);
  const latestRaffle = raffleState && raffleState[raffleState.length - 1];
  const raffleData: { ok: boolean; movie: MovieOfTheWeek } =
    latestRaffle?.data as { ok: boolean; movie: MovieOfTheWeek };
  */
  const isLoading = useRaffleStore.use.isLoading();
  const setIsLoading = useRaffleStore.use.setIsLoading();
  const result = useRaffleStore.use.result();
  const setResult = useRaffleStore.use.setResult();

  const handleClose = () => {
    setResult(null);
    setIsLoading(false);
    setIsOpen(false);
  }

  if (isLoading) {
    return (
      <Dialog.Root open={isOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-blackA10 data-[state=open]:animate-overlayShow fixed inset-0 rounded-md z-40" />
          <Dialog.Content
            onEscapeKeyDown={() => setIsOpen(false)}
            className={`z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-transparent p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none`}
          >
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium flex justify-center">
              Raffle results
            </Dialog.Title>
            <Dialog.Description />
            <div className="flex justify-center">
              <span className="loading loading-circle loading-lg" />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA10 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
        <Dialog.Content
          onEscapeKeyDown={handleClose}
          className={`backdrop-filer z-50 backdrop-blur-md bg-opacity-60 bg-slate12 text-white data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[10px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none`}
        >
          <Dialog.Title className="text-white m-0 text-[27px] font-medium">
            Results of the Draw
          </Dialog.Title>
          <Dialog.Description className="">
            {`Movie for ${
              result && result.movieOfTheWeek
                ? format(
                    new Date(result.movieOfTheWeek),
                    "MMMM do, yyyy"
                  )
                : "this week"
            }`}
          </Dialog.Description>
          <div className="flex justify-center p-5">
            {result !== null && <RaffleResultCard chosenMovie={result} />}
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
