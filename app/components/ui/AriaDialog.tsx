"use client";
import * as Ariakit from "@ariakit/react";

export interface AriaDialogProps {
  children?: React.ReactNode;
  title: string;
  onClose: () => void;
}

export default function AriaDialog({
  title,
  onClose,
  children,
}: AriaDialogProps) {
  return (
    <Ariakit.Dialog
      open
      onClose={onClose}
      backdrop={<div className="bg-black/5 backdrop-blur-sm " />}
      className="fixed z-50 inset-3 flex flex-col gap-1 overflow-auto rounded-md border max-w-fit min-w-96 lg:min-w-[1000px] m-auto bg-background"
    >
      {children}
    </Ariakit.Dialog>
  );
}
