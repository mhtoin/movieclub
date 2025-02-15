import { groupBy, } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/Select";

interface DateSelectProps {
  dates: {
    date: string;
    label: string;
  }[];
  setSelectedDate: (date: string) => void;
  selectedDate: string;
}

export default function DateSelect({
  dates,
  setSelectedDate,
  selectedDate,
}: DateSelectProps) {
  const groupedByYear = groupBy(dates, (date) => {
    const dateObject = date as { date: string; label: string };
    return dateObject?.date?.split("-")[0];
  });

  return (
    <Select
      onValueChange={(value) => setSelectedDate(value)}
      value={selectedDate}
    >
      <SelectTrigger className="max-w-48">
        <SelectValue placeholder={dates[0]?.label} asChild>
          <span>{`${new Date(selectedDate).toLocaleDateString("en-US", {
            month: "long",
          })} ${selectedDate?.split("-")[0]}`}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-w-48 bg-background text-foreground">
        {groupedByYear &&
          Object.keys(groupedByYear).length > 0 &&
          Object.keys(groupedByYear)
            ?.toSorted((a, b) => Number(b) - Number(a))
            ?.map((year) => (
              <SelectGroup
                key={year}
                className="flex flex-col gap-2 justify-center items-center"
              >
                <SelectLabel className="text-lg font-bold">{year}</SelectLabel>
                {groupedByYear[year].map(
                  (date: { date: string; label: string }) => (
                    <SelectItem key={date.date} value={date.date}>
                      {date.label}
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            ))}
      </SelectContent>
    </Select>
  );
}
