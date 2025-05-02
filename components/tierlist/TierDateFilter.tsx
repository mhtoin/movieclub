import { Button } from 'components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from 'components/ui/Select'

export default function TierDateFilter({
  values,
  selectedDate,
  setSelectedDate,
}: {
  values: string[]
  selectedDate: string
  setSelectedDate: (date: string) => void
}) {
  return (
    <Select
      onValueChange={(value) => setSelectedDate(value)}
      value={selectedDate}
    >
      <SelectTrigger className="max-w-48">
        <SelectValue placeholder={'Choose a date'}>
          <span>{selectedDate}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-background text-foreground max-w-48">
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
            e.stopPropagation()
            setSelectedDate('')
          }}
        >
          Clear
        </Button>
      </SelectContent>
    </Select>
  )
}
