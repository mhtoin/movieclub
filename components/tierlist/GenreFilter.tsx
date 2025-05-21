import { Genre } from '@/types/tmdb.type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select'

export default function GenreFilter({
  genreOptions,
}: {
  genreOptions: Genre[]
}) {
  return (
    <Select>
      <SelectTrigger className="max-w-xs">
        <SelectValue placeholder="Select genres" />
      </SelectTrigger>
      <SelectContent>
        {genreOptions.map((option) => (
          <SelectItem key={option.id} value={option.name}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
