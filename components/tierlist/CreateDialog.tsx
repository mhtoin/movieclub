"use client"
import { useState } from "react"
import { Button } from "../ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog"
import { Input } from "../ui/Input"
import { Info, PlusIcon, X } from "lucide-react"
import DateRangePicker from "./TierlistDateRange"
import type { DateRange } from "react-day-picker"
import { useQuery } from "@tanstack/react-query"
import { getAvailableGenres } from "@/lib/movies/queries"
import GenreFilter from "./GenreFilter"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip"
import { useValidateSession } from "@/lib/hooks"
import { SubmitButton } from "./SubmitButton"
import { createTierlistAction } from "@/lib/actions/tierlist/actions"
import FilterLogic from "./FilterLogic"

export function CreateDialog() {
  const { data: user } = useValidateSession()
  const [tiers, setTiers] = useState<{ value: number; label?: string }[]>([])
  const [date, setDate] = useState<DateRange | undefined>()
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [logic, setLogic] = useState<"or" | "and">("or")
  const { data: genreOptions } = useQuery({
    queryKey: ["genres"],
    queryFn: getAvailableGenres,
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create new</Button>
      </DialogTrigger>
      <DialogContent className="isolate max-w-[65dvw] max-h-[90svh] overflow-scroll no-scrollbar">
        <DialogHeader className="flex flex-col items-center w-full border-b pb-4">
          <DialogTitle className="text-lg font-semibold">
            Create a new tierlist
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4 items-center justify-center w-full"
          action={createTierlistAction}
        >
          <p className="text-sm text-muted-foreground">
            Create a new tierlist to rank movies based on your preferences.
            Define tiers, select a date range, and filter by genres.
          </p>

          {/* These are here to get the data to the form data */}
          <input type="hidden" name="userId" value={user?.id || ""} />
          <input type="hidden" name="tiers" value={JSON.stringify(tiers)} />
          <input
            type="hidden"
            name="dateRange"
            value={date ? JSON.stringify(date) : ""}
          />
          <input
            type="hidden"
            name="genres"
            value={JSON.stringify(selectedGenres)}
          />
          <input type="hidden" name="logic" value={logic} />

          <div className="flex flex-col gap-4 w-full justify-center items-center">
            <div className="relative">
              <h3 className="text-lg font-semibold">Filters</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 absolute -top-1 -right-3" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-popover text-popover-foreground">
                    <p>
                      Select a date range to show movies from, along with any
                      genres you want to limit the tierlist to. You can leave
                      any filter empty to show all available movies.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <div className="flex items-center justify-center gap-4 w-full">
                <DateRangePicker date={date} setDate={setDate} />
                <GenreFilter
                  genreOptions={genreOptions ?? []}
                  selectedGenres={selectedGenres}
                  setSelectedGenres={setSelectedGenres}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-4 w-full">
                <h3 className="text-lg font-semibold">Genre filter logic</h3>
                <FilterLogic logic={logic} setLogic={setLogic} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full justify-center items-center">
            <h3 className="text-lg font-semibold">Tiers</h3>
            <Button
              type="button"
              variant="outline"
              size={"avatarSm"}
              onClick={() =>
                setTiers([...tiers, { value: tiers.length + 1, label: "" }])
              }
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
            {tiers.map((_, index) => (
              <div key={index} className="flex items-center gap-2 relative">
                <Input
                  type="text"
                  placeholder="Tier name"
                  className="flex-1 w-full"
                  onChange={(e) => {
                    const newTiers = [...tiers]
                    newTiers[index].label = e.target.value
                    setTiers(newTiers)
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size={"iconXs"}
                  className="absolute -right-1 -top-2 rounded-full w-4 h-4"
                  onClick={() => {
                    setTiers(tiers.filter((_, i) => i !== index))
                  }}
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  )
}
