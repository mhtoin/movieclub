"use client"
import { uniqWith } from "@/lib/utils"
import type {
  TierlistWithTiers,
  TierMovieWithMovieData,
} from "@/types/tierlist.type"
import { Genre } from "@/types/tmdb.type"
import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "@hello-pangea/dnd"
import { useMutation } from "@tanstack/react-query"
import { endOfYear, startOfYear } from "date-fns"
import { getQueryClient } from "lib/getQueryClient"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { type DateRange } from "react-day-picker"
import { toast } from "sonner"
import GenreFilter from "./GenreFilter"
import Tier from "./Tier"
import TierCreate from "./TierCreate"
import DateRangePicker from "./TierlistDateRange"

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
  tierlistData,
}: {
  tierlistId: string
  userId: string
  tierlistData: TierlistWithTiers
}) {
  const queryClient = getQueryClient()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const movieWatchdates = useMemo(() => {
    return tierlistData?.tiers
      ?.flatMap((tier) => tier.movies.map((movie) => movie.movie.watchDate))
      .filter((date) => date !== null && date !== undefined)
      .sort()
  }, [tierlistData])

  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || "",
  )
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(
    tierlistData?.genres || [],
  )
  const [date, setDate] = useState<DateRange | undefined>({
    from: tierlistData?.watchDate?.from
      ? new Date(tierlistData?.watchDate?.from)
      : startOfYear(
          movieWatchdates?.[0] ? new Date(movieWatchdates[0]) : new Date(),
        ),
    to: tierlistData?.watchDate?.to
      ? new Date(tierlistData?.watchDate?.to)
      : endOfYear(
          movieWatchdates?.[movieWatchdates.length - 1]
            ? new Date(movieWatchdates[movieWatchdates.length - 1])
            : new Date(),
        ),
  })

  const [containerState, setContainerState] = useState<
    TierMovieWithMovieData[][] | undefined
  >(undefined)

  const tiers = tierlistData?.tiers.map((tier) => tier.label)
  const isAuthorized = tierlistData?.userId === userId || false
  useEffect(() => {
    const movieMatrix = tierlistData?.tiers.map((tier) => {
      return tier.movies
        .filter((movie) => {
          const watchDate = movie.movie.watchDate
            ? new Date(movie.movie.watchDate)
            : null
          return watchDate && date && date.from && date.to
            ? watchDate >= date.from && watchDate <= date.to
            : true
        })
        .map((movie) => movie)
    })
    setContainerState(movieMatrix)
  }, [tierlistData, selectedDate, date])

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
    if (!isAuthorized || !containerState || !tierlistData) {
      return
    }

    if (selectedDate) {
      toast.error("Reset filters before moving items")
      return
    }

    const { source, destination } = result

    if (!destination) {
      return
    }

    const sInd = +source.droppableId
    const dInd = +destination.droppableId

    const destinationTier = tierlistData.tiers[dInd]

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

      setContainerState(newState)
      //queryClient.setQueryData(["tierlists", tierlistId], saveState);

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

      const sourceTier = tierlistData.tiers[sInd]
      const destinationTier = tierlistData.tiers[dInd]

      if (sourceTier.value === 0) {
        // handle case where no sourceData yet
        const sourceData = sourceTier.movies[source.index]

        // construct a tierMovie object
        const newSourceData = {
          id: "",
          tierId: destinationTier.id,
          position: destination.index,
          movieId: sourceData.movie.id,
          rating: "",
          review: null,
          movie: sourceData.movie, // Add the movie object to match TierMovieWithMovieData
        }

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

        const newSourceData = {
          ...sourceData,
          tierId: destinationTier.id,
          position: destination.index,
        }

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

      setContainerState(newState)
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
      toast.success("Tierlist updated!")
      queryClient.invalidateQueries({
        queryKey: ["tierlists", tierlistId],
      })

      /*if (_variables.operation === 'rank' && _data.data) {
        setSelectedMovie(_data.data)
      }*/
    },
    onError: (error) => {
      toast.error("Updating tierlist failed!", {
        description: error.message,
      })
    },
  })
  const genreOptions = useMemo(() => {
    const allGenres = tierlistData?.tiers
      ?.flatMap((tier) => tier.movies.flatMap((movie) => movie.movie.genres))
      .flat()
    const uniqueGenres = allGenres
      ? uniqWith(allGenres, (a, b) => a?.id === b?.id)
      : []
    return uniqueGenres as Genre[]
  }, [tierlistData])

  console.log("genreOptions", genreOptions)

  return (
    <>
      <div className="flex w-full max-w-[95dvw] min-w-[95dvw] flex-row items-start gap-5">
        <DateRangePicker date={date} setDate={setDate} />
        {genreOptions.length > 0 && (
          <GenreFilter
            genreOptions={genreOptions}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
          />
        )}
      </div>

      <div className="flex flex-col items-start gap-10 md:gap-2 md:overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          {containerState?.map((tier, tierIndex) => (
            <Tier
              key={tierIndex}
              tierIndex={tierIndex}
              tier={tier}
              label={tiers?.[tierIndex] || ""}
            />
          ))}
        </DragDropContext>
        {tierlistData?.tiers && tierlistData?.tiers?.length <= 4 && (
          <TierCreate tierlistId={tierlistId} />
        )}
      </div>

      {/*selectedMovie && (
        <SuccessReview
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )*/}
    </>
  )
}
