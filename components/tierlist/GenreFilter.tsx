import { Genre } from "@/types/tmdb.type"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/Dropdown"
import { Button } from "../ui/Button"

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
          className="w-full justify-start max-w-48 relative"
        >
          <span className="text-ellipsis overflow-hidden whitespace-nowrap ">
            {selectedGenres.length > 0
              ? selectedGenres.map((genre) => genre.name).join(", ")
              : "Select Genres"}
          </span>
          {selectedGenres.length > 0 && (
            <span className="bg-accent text-accent-foreground absolute -top-2 -left-2 flex h-4 w-4 items-center justify-center rounded-full text-xs">
              {selectedGenres.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-[99999]">
        {genreOptions.map((genre) => (
          <DropdownMenuItem
            key={genre.id}
            className="flex items-center gap-2"
            onSelect={(event) => {
              event.preventDefault()
              setSelectedGenres((prev: Genre[]) =>
                prev.some((g) => g.id === genre.id)
                  ? prev.filter((g) => g.id !== genre.id)
                  : [...prev, genre],
              )
            }}
          >
            <span className="w-3 h-3 flex items-center justify-center">
              <div
                className="check"
                data-checked={selectedGenres.some((g) => g.id === genre.id)}
                data-variant="ghost"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 16 16"
                  height="1em"
                  width="1em"
                >
                  <title>Checkbox</title>
                  <polyline points="4,8 7,12 12,4" />
                </svg>
              </div>
            </span>
            {genre.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
