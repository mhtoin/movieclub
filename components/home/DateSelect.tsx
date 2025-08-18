import { getMoviesOfTheMonth } from "@/lib/movies/queries"
import { getNextMonth } from "@/lib/utils"
import type { MovieWithReviews } from "@/types/movie.type"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "components/ui/Button"
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/Popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/Select"
import { CalendarRange } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

interface DateSelectProps {
  months: { month: string; label: string }[]
}

interface InfiniteQueryData {
  pages: Array<{
    month: string
    movies: MovieWithReviews[]
  }>
  pageParams: string[]
}

export default function DateSelect({ months }: DateSelectProps) {
  const [isLoadingMonths, setIsLoadingMonths] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const monthAndYear = searchParams.get("month")?.split("-")
  const date = searchParams.get("date")
  const queryClient = useQueryClient()

  const scrollToMonth = async (targetMonth: string) => {
    setIsLoadingMonths(true)
    try {
      // First check if the target section already exists
      const targetSection = document.querySelector(
        `[data-month="${targetMonth}"]`,
      )

      if (targetSection) {
        // The section already exists, just scroll to it
        targetSection.scrollIntoView({ behavior: "smooth" })
        const params = new URLSearchParams(searchParams)
        params.set("month", targetMonth)
        router.push(`/home?${params.toString()}`)
        setIsLoadingMonths(false)
        return
      }

      // The target month is not yet loaded, so we need to fetch all months in between
      const currentData = queryClient.getQueryData(["pastMovies"]) as
        | InfiniteQueryData
        | undefined
      if (!currentData) {
        setIsLoadingMonths(false)
        return
      }

      let lastMonth = currentData.pages[currentData.pages.length - 1].month

      // Keep fetching next months until we reach the target month or run out of pages
      while (lastMonth !== targetMonth) {
        const nextMonth = getNextMonth(lastMonth)
        const monthData = await getMoviesOfTheMonth(nextMonth)

        // If no more data, break
        if (!monthData || !monthData.month) {
          break
        }

        // Update last fetched month
        lastMonth = monthData.month

        // Manually update the query client with the new data
        queryClient.setQueryData(
          ["pastMovies"],
          (oldData: InfiniteQueryData) => {
            return {
              ...oldData,
              pages: [...oldData.pages, monthData],
              pageParams: [...oldData.pageParams, monthData.month],
            }
          },
        )

        // If we've reached the target month, break
        if (monthData.month === targetMonth) {
          break
        }
      }

      // After loading all months, try to scroll to the target month
      setTimeout(() => {
        const targetSectionAfterLoad = document.querySelector(
          `[data-month="${targetMonth}"]`,
        )
        if (targetSectionAfterLoad) {
          targetSectionAfterLoad.scrollIntoView({ behavior: "smooth" })
          const params = new URLSearchParams(searchParams)
          params.set("month", targetMonth)
          router.push(`/home?${params.toString()}`)
        }
        setIsLoadingMonths(false)
      }, 100)
    } catch (error) {
      console.error("Error scrolling to month:", error)
      setIsLoadingMonths(false)
    }
  }
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <div className="flex w-full flex-row items-center justify-center gap-1">
        <span className="text-primary-foreground text-xs whitespace-nowrap">
          {monthAndYear && date
            ? `${new Date(
                `${monthAndYear[0]}-${monthAndYear[1]}`,
              ).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}`
            : "Select Date"}
        </span>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} size={"icon"} disabled={isLoadingMonths}>
            {isLoadingMonths ? (
              <div className="border-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            ) : (
              <CalendarRange />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="bg-background z-9999 w-48 p-2"
        >
          <Select
            onValueChange={(value) => scrollToMonth(value)}
            value={monthAndYear ? `${monthAndYear[0]}-${monthAndYear[1]}` : ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent className="bg-background z-9999 max-h-60 overflow-y-auto">
              {months.map((item) => (
                <SelectItem key={item.month} value={item.month}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PopoverContent>
      </Popover>
    </div>
  )
}
