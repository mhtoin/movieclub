"use client";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { getMoviesOfTheMonth } from "@/lib/movies/queries";
import { getNextMonth } from "@/lib/utils";
import type { MovieWithReviews } from "@/types/movie.type";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "components/ui/Button";
import { CalendarRange } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Define the type for the infinite query data structure
interface InfiniteQueryData {
	pages: Array<{
		month: string;
		movies: MovieWithReviews[];
	}>;
	pageParams: string[];
}

export default function MovieSidebar({
	months,
}: {
	months: { month: string; label: string }[];
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const monthAndYear = searchParams.get("month")?.split("-");
	const date = searchParams.get("date");
	const queryClient = useQueryClient();

	const [position, setPosition] = useState<{ x: number; y: number } | null>(
		null,
	);
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const sidebarRef = useRef<HTMLDivElement>(null);
	const [isLoadingMonths, setIsLoadingMonths] = useState(false);

	// config
	const [orientation, _setOrientation] = useState<"horizontal" | "vertical">(
		"horizontal",
	);

	// Set initial position after mount
	useEffect(() => {
		setPosition({
			x: 25,
			y:
				orientation === "horizontal"
					? window.innerHeight - 150
					: window.innerHeight / 2 - 100,
		});
	}, [orientation]);

	// Handle mouse events for dragging
	const handleMouseDown = (e: React.MouseEvent) => {
		if (sidebarRef.current) {
			const rect = sidebarRef.current.getBoundingClientRect();
			setDragOffset({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
			setIsDragging(true);
		}
	};

	// Setup event listeners for mouse move and up
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				setPosition({
					x: e.clientX - dragOffset.x,
					y: e.clientY - dragOffset.y,
				});
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, dragOffset]);

	// Function to scroll to a specific month
	const scrollToMonth = async (targetMonth: string) => {
		setIsLoadingMonths(true);
		try {
			// First check if the target section already exists
			const targetSection = document.querySelector(
				`[data-month="${targetMonth}"]`,
			);

			if (targetSection) {
				// The section already exists, just scroll to it
				targetSection.scrollIntoView({ behavior: "smooth" });
				const params = new URLSearchParams(searchParams);
				params.set("month", targetMonth);
				router.push(`/home?${params.toString()}`);
				setIsLoadingMonths(false);
				return;
			}

			// The target month is not yet loaded, so we need to fetch all months in between
			const currentData = queryClient.getQueryData(["pastMovies"]) as
				| InfiniteQueryData
				| undefined;
			if (!currentData) {
				setIsLoadingMonths(false);
				return;
			}

			let lastMonth = currentData.pages[currentData.pages.length - 1].month;

			// Keep fetching next months until we reach the target month or run out of pages
			while (lastMonth !== targetMonth) {
				const nextMonth = getNextMonth(lastMonth);
				const monthData = await getMoviesOfTheMonth(nextMonth);

				// If no more data, break
				if (!monthData || !monthData.month) {
					break;
				}

				// Update last fetched month
				lastMonth = monthData.month;

				// Manually update the query client with the new data
				queryClient.setQueryData(["pastMovies"], (oldData: InfiniteQueryData) => {
					return {
						...oldData,
						pages: [...oldData.pages, monthData],
						pageParams: [...oldData.pageParams, monthData.month],
					};
				});

				// If we've reached the target month, break
				if (monthData.month === targetMonth) {
					break;
				}
			}

			// After loading all months, try to scroll to the target month
			setTimeout(() => {
				const targetSectionAfterLoad = document.querySelector(
					`[data-month="${targetMonth}"]`,
				);
				if (targetSectionAfterLoad) {
					targetSectionAfterLoad.scrollIntoView({ behavior: "smooth" });
					const params = new URLSearchParams(searchParams);
					params.set("month", targetMonth);
					router.push(`/home?${params.toString()}`);
				}
				setIsLoadingMonths(false);
			}, 100);
		} catch (error) {
			console.error("Error scrolling to month:", error);
			setIsLoadingMonths(false);
		}
	};

	return (
		<div
			ref={sidebarRef}
			className="fixed flex flex-col items-center justify-center bg-transparent rounded-3xl z-[9998]  cursor-move"
			style={{
				left: `${position?.x}px`,
				top: `${position?.y}px`,
				userSelect: "none",
			}}
			onMouseDown={handleMouseDown}
		>
			<div
				className={`relative bg-transparent rounded-full flex justify-around items-center py-6  ${
					orientation === "horizontal" ? "h-28 w-28 flex-row" : "h-44 w-28 flex-col"
				}`}
			>
				{/*<div className="flex flex-col gap-2 items-center justify-center">
					<RaffleDialog />
					<span className="text-xs">Raffle</span>
				</div>*/}

				<div className="flex flex-col gap-2 items-center justify-center">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant={"outline"} size={"icon"} disabled={isLoadingMonths}>
								{isLoadingMonths ? (
									<div className="w-4 h-4 rounded-full border-2 border-t-transparent border-foreground animate-spin" />
								) : (
									<CalendarRange />
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent
							side="top"
							align="end"
							className="w-48 p-2 z-[9999] bg-background"
						>
							<Select
								onValueChange={(value) => scrollToMonth(value)}
								value={monthAndYear ? `${monthAndYear[0]}-${monthAndYear[1]}` : ""}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select month" />
								</SelectTrigger>
								<SelectContent className="max-h-60 overflow-y-auto z-[9999] bg-background">
									{months.map((item) => (
										<SelectItem key={item.month} value={item.month}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</PopoverContent>
					</Popover>
					<div
						className={`flex gap-1 ${orientation === "horizontal" ? "flex-row" : "flex-col"}`}
					>
						<span className="text-xs">
							{monthAndYear && date
								? `${new Date(
										`${monthAndYear[0]}-${monthAndYear[1]}`,
									).toLocaleDateString("en-US", {
										month: "long",
										year: "numeric",
									})}`
								: "Select Date"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
