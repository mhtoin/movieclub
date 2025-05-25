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
import { getAvailableGenres, getFilters } from "@/lib/movies/queries"
import { Genre } from "@/types/tmdb.type"
import GenreFilter from "./GenreFilter"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip"
import { createTierlist } from "@/lib/actions/tierlist/actions"
import { useValidateSession } from "@/lib/hooks"

export function CreateDialog() {
  const { data: user } = useValidateSession()
  const [tiers, setTiers] = useState<{ value: number; label?: string }[]>([])
  const [date, setDate] = useState<DateRange | undefined>()
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const { data: genreOptions } = useQuery({
    queryKey: ["genres"],
    queryFn: getAvailableGenres,
  })

  if (!user) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled>
            Create new
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <p>Please log in to create a new tierlist.</p>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create new</Button>
      </DialogTrigger>
      <DialogContent className="isolate max-w-[65dvw] max-h-[90svh] overflow-scroll no-scrollbar">
        <DialogHeader className="flex flex-col items-center w-full border-b pb-4">
          <DialogTitle className="text-lg font-semibold">
            Create new tierlist
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 items-center justify-center w-full">
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
            <div className="flex items-center justify-center gap-2 w-full">
              <DateRangePicker date={date} setDate={setDate} />
              <GenreFilter
                genreOptions={genreOptions ?? []}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full justify-center items-center">
            <h3 className="text-lg font-semibold">Tiers</h3>
            <Button
              variant="outline"
              size={"avatarSm"}
              onClick={() =>
                setTiers([...tiers, { value: tiers.length + 1, label: "" }])
              }
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
            {tiers.map((tier, index) => (
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
          <Button
            variant="outline"
            onClick={async () => {
              // Handle tierlist creation logic here
              console.log("Creating tierlist with tiers:", tiers)
              console.log("Selected date range:", date)
              console.log("Selected genres:", selectedGenres)

              // Filter out tiers with empty labels
              const validTiers = tiers.filter(
                (tier): tier is { value: number; label: string } =>
                  typeof tier.label === "string" && tier.label.trim() !== "",
              )

              // Check if we have any valid tiers
              if (validTiers.length === 0) {
                alert("Please define at least one tier with a label.")
                return
              }

              // Only pass date if both from and to are defined
              const validDateRange =
                date && date.from && date.to
                  ? {
                      from: date.from,
                      to: date.to,
                    }
                  : undefined

              const createdTierlist = await createTierlist(
                user.id,
                validTiers,
                validDateRange,
                selectedGenres,
              )

              console.log("Created tierlist in dialog:", createdTierlist)
            }}
          >
            Create Tierlist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
