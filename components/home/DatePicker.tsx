"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format, isWednesday } from "date-fns";
import * as React from "react";

import { Button } from "components/ui/Button";
import { Calendar } from "components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/Popover";

import { cn } from "@/lib/utils";

export function DatePicker({
	selected,
	setSelected,
}: {
	selected: Date;
	setSelected: (date: Date) => void;
}) {
	const [date, _setDate] = React.useState<Date>();

	const isDateMovieDate = (date: Date) => {
		return !isWednesday(date);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[240px] justify-start text-left font-normal",
						!date && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{selected ? format(selected, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={selected}
					disabled={isDateMovieDate}
					onSelect={(date) => {
						setSelected(date || new Date());
					}}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
