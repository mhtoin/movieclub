"use client";

import { Icon } from "@iconify/react";
import { useRaffleStore } from "@/stores/useRaffleStore";
import { useRaffleMutation } from "@/lib/hooks";

export function RaffleClient() {
  const setIsLoading = useRaffleStore.use.setIsLoading();
  const setIsOpen = useRaffleStore.use.setIsOpen();
  const setSenderIsCurrentUser = useRaffleStore.use.setSenderIsCurrentUser();
  const sender = useRaffleStore((state) => state.senderIsCurrentUser);
  //const allShortlists = await getAllShortLists()
  const raffle = useRaffleMutation();

  return (
    <div className="hidden fixed z-50 bottom-20 right-8 sm:block">
       <button
          className="btn btn-circle btn-primary btn-md text-2xl 2xl:btn-lg 2xl:text-4xl"
          onClick={() => {
            //console.log("clicked");
            setIsLoading(true);
            setIsOpen(true);
            setSenderIsCurrentUser(true);
            raffle.mutate();
            console.log(sender)
          }}
        >
          <Icon icon="game-icons:card-random" />
        </button>
    </div>
  );
}
