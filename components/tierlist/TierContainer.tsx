"use client"
import { uniqWith } from "@/lib/utils"
import type { TierMovieWithMovieData } from "@/types/tierlist.type"
import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "@hello-pangea/dnd"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { endOfYear, startOfYear } from "date-fns"
import { getQueryClient } from "lib/getQueryClient"
import { useEffect, useMemo, useState } from "react"
import { type DateRange } from "react-day-picker"
import { toast } from "sonner"
import GenreFilter from "./GenreFilter"
import Tier from "./Tier"
import DateRangePicker from "./TierlistDateRange"
import { tierlistKeys } from "@/lib/tierlist/tierlistKeys"
import TierlistShareDialog from "./TierlistShareDialog"

type MoveItemObject = {
  [x: string]: TierMovieWithMovieData[]
}
const reorder = (
  tier: TierMovieWithMovieData[],
  startIndex: number,
  endIndex: number,
) => {
  const result = Array.from(tier)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result.map((item, index) => ({
    ...item,
    position: index,
  }))
}

const moveItem = (
  sourceTier: TierMovieWithMovieData[],
  destinationTier: TierMovieWithMovieData[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation,
) => {
  const sourceClone = Array.from(sourceTier)
  const destinationClone = Array.from(destinationTier)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destinationClone.splice(droppableDestination.index, 0, removed)

  const result = {} as MoveItemObject
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destinationClone
  return result
}

export default function DnDTierContainer({
  tierlistId,
  userId,
}: {
  tierlistId: string
  userId: string
}) {
  const queryClient = getQueryClient()
  const { data: tierlist } = useSuspenseQuery(tierlistKeys.byId(tierlistId))
  const movieWatchdates = useMemo(() => {
    return tierlist?.tiers
      ?.flatMap((tier) => tier.movies.map((movie) => movie.movie.watchDate))
      .filter((date) => date !== null && date !== undefined)
      .sort()
  }, [tierlist])

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    tierlist?.genres || [],
  )
  const [date, setDate] = useState<DateRange | undefined>({
    from: tierlist?.watchDate?.from
      ? new Date(tierlist?.watchDate?.from)
      : startOfYear(
          movieWatchdates?.[0] ? new Date(movieWatchdates[0]) : new Date(),
        ),
    to: tierlist?.watchDate?.to
      ? new Date(tierlist?.watchDate?.to)
      : endOfYear(
          movieWatchdates?.[movieWatchdates.length - 1]
            ? new Date(movieWatchdates[movieWatchdates.length - 1])
            : new Date(),
        ),
  })

  const [containerState, setContainerState] = useState<
    TierMovieWithMovieData[][] | undefined
  >(undefined)
  const [isUpdating, setIsUpdating] = useState(false)
  const [previousState, setPreviousState] = useState<
    TierMovieWithMovieData[][] | undefined
  >(undefined)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const tiers = tierlist?.tiers.map((tier) => tier.label)
  const isAuthorized = tierlist?.userId === userId || false
  useEffect(() => {
    const movieMatrix = tierlist?.tiers.map((tier) => {
      return tier.movies
        .filter((movie) => {
          const watchDate = movie.movie.watchDate
            ? new Date(movie.movie.watchDate)
            : null
          return watchDate && date && date.from && date.to
            ? watchDate >= date.from && watchDate <= date.to
            : true
        })
        .filter((movie) => {
          if (selectedGenres.length === 0) {
            return true
          }
          return movie?.movie?.genres?.some((genre) =>
            selectedGenres.some((selectedGenre) => selectedGenre === genre),
          )
        })
        .map((movie) => movie)
    })
    setContainerState(movieMatrix)
  }, [tierlist, selectedGenres, date])

  /*
  const handleDateChange = (date: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (date === "") {
      params.delete("date")
    } else {
      params.set("date", date)
    }
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
    setSelectedDate(date)
    const movieMatrix = tierlistData?.tiers.map((tier) => {
      return tier.movies
        .filter((movieData) =>
          selectedDate
            ? movieData?.movie?.watchDate?.split("-")[0] === selectedDate
            : true,
        )
        .map((movieData) => movieData)
    })

    setContainerState(movieMatrix)
  }*/

  function onDragEnd(result: DropResult) {
    if (!isAuthorized) {
      toast.error("You are not authorized to edit this tierlist.")
      return
    }

    if (isUpdating) {
      toast.error("Please wait for the current update to complete.")
      return
    }

    if (!containerState || !tierlist) {
      toast.error("Tierlist or container state is not available.")
      return
    }

    const { source, destination } = result

    if (!destination) {
      return
    }

    const sInd = +source.droppableId
    const dInd = +destination.droppableId

    const destinationTier = tierlist.tiers[dInd]

    if (destinationTier.value === 0) {
      // handle case where no sourceData yet
      toast.error("Cannot unrank or reorder unranked items at this time")
      return
    }

    if (sInd === dInd) {
      const items = reorder(
        containerState?.[sInd],
        source.index,
        destination.index,
      )

      /**
       * Newstate contains the movies in the correct order
       */
      const newState = [...containerState]
      newState[sInd] = items

      /**
       * Technically, all we need to do is update the position of the source and the target
       * source now has the destination index, and the destination has the source index
       */

      // get the affected items
      const startIdx = Math.min(source.index, destination.index)
      const endIdx = Math.max(source.index, destination.index)
      const affectedItems = items.slice(startIdx, endIdx + 1)

      // Store previous state for potential rollback
      setPreviousState(containerState)
      // Apply optimistic update
      setContainerState(newState)

      saveMutation.mutate({
        data: {
          items: affectedItems,
        },
        operation: "reorder",
      })
    } else {
      const result = moveItem(
        containerState[sInd],
        containerState[dInd],
        source,
        destination,
      )
      const newState = [...containerState]
      newState[sInd] = result[sInd]
      newState[dInd] = result[dInd]

      const sourceTier = tierlist.tiers[sInd]
      const destinationTier = tierlist.tiers[dInd]

      if (sourceTier.value === 0) {
        // handle case where no sourceData yet
        const sourceData = sourceTier.movies[source.index]

        // Get the actual position in the destination tier considering all movies (not just filtered ones)
        const destinationTierAllMovies = tierlist.tiers[dInd].movies
        const actualDestinationPosition = Math.min(
          destination.index,
          destinationTierAllMovies.length,
        )

        // construct a tierMovie object
        const newSourceData = {
          id: "",
          tierId: destinationTier.id,
          position: actualDestinationPosition,
          movieId: sourceData.movie.id,
          rating: "",
          review: null,
          movie: sourceData.movie, // Add the movie object to match TierMovieWithMovieData
        }

        // Store previous state for potential rollback
        setPreviousState(containerState)
        // Apply optimistic update
        setContainerState(newState)

        // update the tierlist
        saveMutation.mutate({
          data: {
            sourceData: newSourceData,
            sourceTierId: sourceTier.id,
            destinationTierId: destinationTier.id,
          },
          operation: "rank",
        })
      } else {
        const sourceData = sourceTier.movies[source.index]

        // Get the actual position in the destination tier considering all movies (not just filtered ones)
        const destinationTierAllMovies = tierlist.tiers[dInd].movies
        const actualDestinationPosition = Math.min(
          destination.index,
          destinationTierAllMovies.length,
        )

        const newSourceData = {
          ...sourceData,
          tierId: destinationTier.id,
          position: actualDestinationPosition,
        }

        // Store previous state for potential rollback
        setPreviousState(containerState)
        // Apply optimistic update
        setContainerState(newState)

        saveMutation.mutate({
          data: {
            sourceData: sourceData,
            updatedSourceData: newSourceData,
            sourceTierId: sourceTier.id,
            destinationTierId: destinationTier.id,
          },
          operation: "move",
        })
      }
    }
  }

  const saveMutation = useMutation({
    mutationFn: async ({
      data,
      operation,
    }: {
      data: {
        sourceData?: TierMovieWithMovieData
        updatedSourceData?: TierMovieWithMovieData
        sourceTierId?: string
        destinationTierId?: string
        destinationData?: TierMovieWithMovieData
        items?: TierMovieWithMovieData[]
      }
      operation: "reorder" | "move" | "rank"
    }) => {
      setIsUpdating(true)
      const res = await fetch(
        `/api/tierlists/${tierlistId}?operation=${operation}`,
        {
          method: "PUT",
          body: JSON.stringify({
            data,
          }),
        },
      )

      const body: { ok: boolean; data?: TierMovieWithMovieData } =
        await res.json()

      if (body.ok) {
        return body
      }
      throw new Error("Updating tierlist failed", { cause: body })
    },
    onSuccess: (_data, _variables, _context) => {
      /*if (_variables.operation === 'rank' && _data.data) {
        setSelectedMovie(_data.data)
      }*/
      toast.success("Tierlist updated!")
      // Clear the previous state since the update was successful
      setPreviousState(undefined)
      // Refresh the tierlist data to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["tierlists", tierlistId],
      })
      setIsUpdating(false)
    },
    onError: (error) => {
      toast.error("Updating tierlist failed!", {
        description: error.message,
      })
      // Rollback to previous state on error
      if (previousState) {
        setContainerState(previousState)
        setPreviousState(undefined)
      }
      queryClient.invalidateQueries({
        queryKey: ["tierlists", tierlistId],
      })
      setIsUpdating(false)
    },
  })
  const genreOptions = useMemo(() => {
    const allGenres = tierlist?.tiers
      ?.flatMap((tier) => tier.movies.flatMap((movie) => movie.movie.genres))
      .flat()
    const uniqueGenres = allGenres ? uniqWith(allGenres, (a, b) => a === b) : []
    return uniqueGenres
  }, [tierlist])

  console.log("genreOptions", genreOptions)

  return (
    <>
      <div className="flex w-full max-w-[95dvw] min-w-[95dvw] flex-row gap-5">
        <div className="flex items-start gap-2">
          <DateRangePicker date={date} setDate={setDate} disabled={true} />
          {genreOptions.length > 0 && (
            <GenreFilter
              genreOptions={genreOptions}
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
              disabled={true}
            />
          )}
        </div>
        <TierlistShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          tierlist={tierlist}
          userId={userId}
        />
      </div>

      <div className="flex flex-col items-start gap-10 md:gap-2 md:overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div>
            {containerState?.map((tier, tierIndex) => (
              <Tier
                key={tierIndex}
                tierIndex={tierIndex}
                tier={tier}
                label={tiers?.[tierIndex] || ""}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </>
  )
}
