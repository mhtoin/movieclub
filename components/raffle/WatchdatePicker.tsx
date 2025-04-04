"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "components/ui/button";
import { Calendar } from "components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";

export function WatchdatePicker({
	watchDate,
	setWatchDate,
}: {
	watchDate: Date;
	setWatchDate: (date: Date) => void;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[220px] justify-start text-left font-normal",
						!watchDate && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{watchDate ? format(watchDate, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0 z-[9999]">
				<Calendar
					mode="single"
					weekStartsOn={1}
					selected={watchDate}
					onSelect={(date) => date && setWatchDate(date)}
					initialFocus
					classNames={{
						day_selected: "bg-accent",
						day_today: "bg-transparent",
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}
