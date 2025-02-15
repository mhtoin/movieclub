"use client";

import { useQuery } from "@tanstack/react-query";
import PosterCarousel from "components/home/PosterCarousel";
import { format, formatISO, nextWednesday } from "date-fns";
import { movieKeys } from "lib/movies/movieKeys";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DateSelect from "./DateSelect";

export default function ListView() {
	const nextMovieDate = formatISO(nextWednesday(new Date()), {
		representation: "date",
	});
	const [selectedDate, setSelectedDate] = useState<string | null>(
		nextMovieDate.split("-").slice(0, 2).join("-"),
	);

	const { data } = useQuery(movieKeys.next(nextMovieDate));
	const router = useRouter();

	const dates = Object.keys(data || {}).map((date) => ({
		date: date,
		label: format(new Date(date), "MMMM"),
	}));

	const handleDateChange = (date: string) => {
		setSelectedDate(date);
		router.push(`#${date}`);
	};

	return (
		<div className="flex flex-col gap-4 overflow-hidden max-h-screen overscroll-none">
			<div className="flex justify-center">
				<DateSelect
					dates={dates}
					setSelectedDate={handleDateChange}
					selectedDate={selectedDate || ""}
				/>
			</div>
			<PosterCarousel />
		</div>
	);
}
