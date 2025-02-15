import { Button } from "components/ui/Button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "components/ui/Select";

export default function TierDateFilter({
	values,
	selectedDate,
	setSelectedDate,
}: {
	values: string[];
	selectedDate: string;
	setSelectedDate: (date: string) => void;
}) {
	return (
		<Select
			onValueChange={(value) => setSelectedDate(value)}
			value={selectedDate}
		>
			<SelectTrigger className="max-w-48">
				<SelectValue placeholder={"Choose a date"} asChild>
					<span>{selectedDate}</span>
				</SelectValue>
			</SelectTrigger>
			<SelectContent className="max-w-48 bg-background text-foreground">
				{values.map((value) => (
					<SelectItem key={value} value={value}>
						{value}
					</SelectItem>
				))}
				<SelectSeparator />
				<Button
					className="w-full px-2"
					variant="secondary"
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						setSelectedDate("");
					}}
				>
					Clear
				</Button>
			</SelectContent>
		</Select>
	);
}
