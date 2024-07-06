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
      className="fixed border-1 z-50 inset-3 flex flex-col max-h-[calc(100dvh - 2 * 3.75rem)] gap-1 overflow-auto rounded-md p-3 "
    >
      {children}
    </Ariakit.Dialog>
  );
}
