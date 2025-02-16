"use client";
import { useState } from "react";
import RaffleDialog from "./RaffleDialog";

export default function RaffleButton() {
	const [isOpen, _setIsOpen] = useState(false);

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
