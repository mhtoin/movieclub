"use client";
import { PropsWithChildren, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { useRaffleStore } from "@/stores/useRaffleStore";

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
  const [notification, setNotification] = useState();
  const isOpen = useRaffleStore.use.isOpen();
  const setIsOpen = useRaffleStore.use.setIsOpen();
  const raffle = useMutation({
    mutationFn: initiateRaffle,
    onSuccess: (data) => {
      if (data.ok) {
      } else {
        if (data.message) {
          console.log('message', data.message)
          setNotification(data.message);
        }
        setIsOpen(true);
      }
    },
  });

  if (raffle.isPending) {
    return (
      <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA11 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={() => setIsOpen(false)}
          className={`data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-transparent p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none`}
        >
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Raffle results
          </Dialog.Title>
          <Dialog.Description />
          <div className="flex justify-center">
            {raffle.isPending && <span className="loading loading-circle loading-lg" />}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    )
  }
  console.log("notification", notification);
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={() => setIsOpen(false)}
          className={`backdrop-filer backdrop-blur-md bg-opacity-60 bg-blackA9 text-white data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none`}
        >
          <Dialog.Title className="text-white m-0 text-[17px] font-medium">
            Raffle results
          </Dialog.Title>
          <Dialog.Description />
          <div className="flex justify-center">
            <div className="">{notification}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
