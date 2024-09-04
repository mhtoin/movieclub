"use client";
import * as Ariakit from "@ariakit/react";
import { useDialogStore } from "@/stores/useDialogStore";
import { Button } from "../ui/Button";

export default function ReplaceDialog() {
  const dialog = Ariakit.useDialogStore();
  const isOpen = useDialogStore.use.isOpen();
  const setIsOpen = useDialogStore.use.setIsOpen();
  console.log("isOpen", isOpen);

  return (
    <Ariakit.Dialog
      store={dialog}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      backdrop={<div className="bg-black/5 backdrop-blur-sm " />}
      className="fixed z-[9999] inset-3 flex flex-col gap-1 overflow-auto rounded-md border max-w-fit min-w-96 h-96 m-auto bg-background"
    >
      <div className="flex flex-col gap-1 overflow-auto">
        <div>
          <Button variant={"outline"}>OK</Button>
        </div>
      </div>
    </Ariakit.Dialog>
  );
}
