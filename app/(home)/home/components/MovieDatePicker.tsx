import { getAllMoviesOfTheWeek } from "@/lib/movies/queries";
import { useQuery } from "@tanstack/react-query";
import { isWednesday } from "date-fns";
import type { Dispatch, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const MovieDatePicker = ({
	selected,
	setSelected,
}: {
	selected: Date;
	setSelected: Dispatch<SetStateAction<Date>>;
}) => {
	const { data } = useQuery({
		queryKey: ["movieOfTheWeek"],
		queryFn: getAllMoviesOfTheWeek,
	});

	const isDateMovieDate = (date: Date) => {
		return isWednesday(date);
	};

	const highletedDates = data
		? Object.values<MovieOfTheWeek>(data).map(
				(movie: MovieOfTheWeek) => new Date(movie.movieOfTheWeek ?? ""),
			)
		: [];
	return (
		<DatePicker
			showIcon
			selected={selected}
			onChange={(date: Date) => setSelected(date)}
			filterDate={isDateMovieDate}
			dateFormat="dd.MM.yyyy"
			className="input w-full text-center max-w-[300px] m-auto text-md font-bold rounded-md"
			highlightDates={highletedDates}
			icon={
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					width={28}
					height={28}
					stroke="currentColor"
					className="w-9 h-9 cursor-pointer text-3xl"
				>
					<title>Choose a date</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
					/>
				</svg>
			}
		/>
	);
};
