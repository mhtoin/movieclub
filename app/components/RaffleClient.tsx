"use client";

import { Icon } from "@iconify/react";
import { useRaffleStore } from "@/stores/useRaffleStore";
import { useRaffleMutation } from "@/lib/hooks";
import { Button } from "./ui/Button";

export function RaffleClient() {
  const setIsLoading = useRaffleStore.use.setIsLoading();
  const setIsOpen = useRaffleStore.use.setIsOpen();
  const setSenderIsCurrentUser = useRaffleStore.use.setSenderIsCurrentUser();
  const sender = useRaffleStore((state) => state.senderIsCurrentUser);
  //const allShortlists = await getAllShortLists()
  const raffle = useRaffleMutation();

  return (
    <div className="hidden fixed z-50 bottom-20 right-8 sm:block">
      <Button
        className="text-2xl 2xl:text-4xl rounded-full"
        size={"iconLg"}
        onClick={() => {
          setIsLoading(true);
          setIsOpen(true);
          setSenderIsCurrentUser(true);
          raffle.mutate();
        }}
      >
        <Icon icon="game-icons:card-random" />
      </Button>
    </div>
  );
}
