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
import { Button } from "components/ui/Button";
import { CalendarRange, Clapperboard, Settings, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function MovieSidebar() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const monthAndYear = searchParams.get("month")?.split("-");
	const date = searchParams.get("date");

	const [position, setPosition] = useState({ x: 5, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const sidebarRef = useRef<HTMLDivElement>(null);

	// config
	const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
		"horizontal",
	);

	// Set initial position after mount
	useEffect(() => {
		setPosition({ x: 5, y: window.innerHeight / 2 - 100 });
	}, []);

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

	return (
		<div
			ref={sidebarRef}
			className="fixed flex flex-col bg-background rounded-full z-[9998] border border-border cursor-move"
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				userSelect: "none",
			}}
			onMouseDown={handleMouseDown}
		>
			<div
				className={`relative bg-background rounded-full flex  justify-center items-center py-6 gap-10 ${
					orientation === "horizontal" ? "h-24 w-80 flex-row" : "h-80 w-24 flex-col"
				}`}
			>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"ghost"}
							size={"iconSm"}
							className={`absolute ${
								orientation === "horizontal"
									? "top-2 right-5"
									: "top-0 right-1/2 translate-x-1/2"
							}`}
						>
							<Settings />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						side="top"
						align="end"
						alignOffset={-10}
						className="z-[9999] bg-background w-fit p-2"
					>
						<div className="flex flex-col gap-2">
							<label className="text-sm text-foreground/50 px-2" htmlFor="orientation">
								Orientation
							</label>
							<Select
								value={orientation}
								onValueChange={(value) =>
									setOrientation(value as "horizontal" | "vertical")
								}
							>
								<SelectTrigger>
									<SelectValue
										placeholder="Orientation"
										className="text-foreground placeholder:text-foreground/50"
									/>
								</SelectTrigger>
								<SelectContent className="text-foreground z-[9999] bg-background p-2">
									<SelectItem value="horizontal" className="text-sm">
										Horizontal
									</SelectItem>
									<SelectItem value="vertical">Vertical</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</PopoverContent>
				</Popover>
				<div className="flex flex-col gap-2 items-center justify-center">
					<Button
						variant={"outline"}
						size={"icon"}
						onClick={() => {
							const params = new URLSearchParams(searchParams);
							params.set("viewMode", "details");
							router.push(`/home?${params.toString()}`);
						}}
					>
						<Clapperboard />
					</Button>
					<span className="text-xs">Details</span>
				</div>
				<div className="flex flex-col gap-2 items-center justify-center">
					<Button
						variant={"outline"}
						size={"icon"}
						onClick={() => {
							const params = new URLSearchParams(searchParams);
							params.set("viewMode", "reviews");
							router.push(`/home?${params.toString()}`);
						}}
					>
						<Star />
					</Button>
					<span className="text-xs">Reviews</span>
				</div>
				<div className="flex flex-col gap-2 items-center justify-center">
					<Button variant={"outline"} size={"icon"}>
						<CalendarRange />
					</Button>
					<span className="text-xs">
						{monthAndYear && date ? `${date}.${monthAndYear[1]}` : "Select Date"}
					</span>
				</div>
			</div>
		</div>
	);
}
