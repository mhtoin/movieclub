"use client";

import { CalendarCheck, Dices } from "lucide-react";
import { Button } from "../ui/Button";
import { useState } from "react";
import { useSuspenseShortlistsQuery } from "@/lib/hooks";
import { Checkbox } from "../ui/Checkbox";
import RaffleDialog from "./RaffleDialog";

export default function RaffleButton() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: allShortlists,
    isLoading,
    status,
  } = useSuspenseShortlistsQuery();
  return (
    <div
      className={`fixed p-5 z-50 flex items-center justify-center flex-col gap-7 border transition-all duration-500 ${
        isOpen
          ? "h-42 w-[300px] rounded-lg bottom-16 right-16"
          : "w-20 h-20 rounded-lg bottom-10 right-16"
      }`}
    >
      <RaffleDialog />
    </div>
  );
}
