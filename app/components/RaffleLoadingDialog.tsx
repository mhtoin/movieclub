"use client"
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

export default function RaffleLoadingDialog({ children }: PropsWithChildren) {
  const [notification, setNotification] = useState();
  const isOpen = useRaffleStore.use.isOpen();
  const setIsOpen = useRaffleStore.use.setIsOpen();
  const raffle = useMutation({
    mutationFn: initiateRaffle,
    onSuccess: (data) => {
      if (data.ok) {
      } else {
        if (data.message) {
          setNotification(data.message);
        }
        setIsOpen(true);
      }
    },
  });
  
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Raffle results
          </Dialog.Title>
          <Dialog.Description />
          <div className="flex flex-col justify-center bg-transparent">
            <div className="flex text-black">{notification}</div>
          </div>
          <div className="flex">
            <Dialog.Close asChild>
              <button
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
