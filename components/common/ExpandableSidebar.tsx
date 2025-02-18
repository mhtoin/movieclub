"use client";
import { Button } from "components/ui/Button";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ExpandableSidebar({
	children,
}: { children: React.ReactNode }) {
	const [isExpanded, setIsExpanded] = useState(true);
	return (
		<aside
			className={`relative h-full transition-all duration-300 ${isExpanded ? "w-96" : "w-0"}`}
		>
			{children}
			<Button
				variant={"outline"}
				size={"icon"}
				onClick={() => setIsExpanded(!isExpanded)}
				className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2  transition-colors"
			>
				{isExpanded ? (
					<ChevronLeft className="w-6 h-6" />
				) : (
					<ChevronRight className="w-6 h-6 ml-3 transition-transform duration-300" />
				)}
			</Button>
		</aside>
	);
}
