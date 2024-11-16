import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
        <SelectValue placeholder={values[0]} asChild>
          <span>{selectedDate}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-w-48 bg-background text-foreground">
        {values.map((value) => (
          <SelectItem key={value} value={value}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
