"use client";

import DateSelect from "@/components/home/DateSelect";
import RaffleDialog from "@/components/raffle/RaffleDialog";
import { AnimatePresence, motion } from "framer-motion";
import { WrenchIcon } from "lucide-react";
import { useState } from "react";

export default function ToolBar({
	months,
}: {
	months: { month: string; label: string }[];
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	return (
		<button
			type="button"
			className="fixed flex flex-col items-center justify-center gap-2 bottom-5 left-5 group"
			onClick={() => setIsExpanded(!isExpanded)}
		>
			<div
				className="w-14 h-14 flex items-center justify-center gap-2 flex-col bg-background relative border rounded-full p-4 hover:bg-background/20 group-hover:scale-105 group-hover:shadow-lg group-hover:bg-card/20 transition-all duration-300"
				data-expanded={isExpanded}
			>
				<WrenchIcon className="w-6 h-6" />
				<AnimatePresence mode="wait" propagate>
					{isExpanded && (
						<motion.div
							key="raffle"
							className="absolute -bottom-0 -right-16 gap-2 rounded-full flex flex-col items-center justify-center"
							initial={{ opacity: 0, y: 10, x: -10, scale: 0.9 }}
							animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, x: -10, scale: 0.9 }}
							transition={{
								type: "spring",
								duration: 0.8,
								bounce: 0.5,
							}}
						>
							<span className="text-xs font-medium">Raffle</span>
							<RaffleDialog />
						</motion.div>
					)}
				</AnimatePresence>
				<AnimatePresence mode="wait" propagate>
					{isExpanded && (
						<motion.div
							key="raffle"
							className="absolute -top-20 -right-8 gap-2 rounded-full flex flex-col items-center justify-center"
							initial={{ opacity: 0, y: 10, x: -10, scale: 0.9 }}
							animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, x: -10, scale: 0.9 }}
							transition={{
								type: "spring",
								duration: 0.8,
								bounce: 0.5,
							}}
						>
							<DateSelect months={months} />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<p className="text-xs font-medium">Tools</p>
		</button>
	);
}
