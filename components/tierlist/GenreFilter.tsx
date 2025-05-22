import { Genre } from "@/types/tmdb.type"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/Dropdown"
import { Button } from "../ui/Button"
import { Check } from "lucide-react"

export default function GenreFilter({
  genreOptions,
  selectedGenres,
  setSelectedGenres,
}: {
  genreOptions: Genre[]
  selectedGenres: Genre[]
  setSelectedGenres: React.Dispatch<React.SetStateAction<Genre[]>>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start max-w-40 overflow-hidden"
        >
          {selectedGenres.length > 0
            ? selectedGenres.map((genre) => genre.name).join(", ")
            : "Select Genres"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {genreOptions.map((genre) => (
          <DropdownMenuItem
            key={genre.id}
            className="flex items-center gap-2"
            onSelect={(event) => {
              event.preventDefault()
              setSelectedGenres((prev: Genre[]) =>
                prev.includes(genre)
                  ? prev.filter((g) => g !== genre)
                  : [...prev, genre],
              )
            }}
          >
            <span className="w-3 h-3">
              {selectedGenres.includes(genre) && <Check className="w-3 h-3" />}
            </span>
            {genre.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
