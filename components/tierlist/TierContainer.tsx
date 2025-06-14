'use client'
import SuccessReview from '@/components/tierlist/SuccessReview'
import type { TierMovieWithMovieData } from '@/types/tierlist.type'
import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from '@hello-pangea/dnd'
import type { TierMovie } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getQueryClient } from 'lib/getQueryClient'
import { tierlistKeys } from 'lib/tierlist/tierlistKeys'
import { Loader2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Tier from './Tier'
import TierCreate from './TierCreate'
import TierDateFilter from './TierDateFilter'

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
  authorized,
}: {
  tierlistId: string
  authorized: boolean
}) {
  const queryClient = getQueryClient()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] =
    useState<TierMovieWithMovieData | null>(null)
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get('date') || '',
  )
  const { data: tierlistData, status: tierlistStatus } = useQuery(
    tierlistKeys.byId(tierlistId),
  )

  const [containerState, setContainerState] = useState<
    TierMovieWithMovieData[][] | undefined
  >(undefined)

  const tiers = tierlistData?.tierlistTiers.map((tier) => tier.label)

  useEffect(() => {
    const movieMatrix = tierlistData?.tierlistTiers.map((tier) => {
      return tier.value === 0
        ? tier.movies
            .filter((movie) =>
              selectedDate
                ? movie.watchDate?.split('-')[0] === selectedDate
                : true,
            )
            .map((movie, index) => {
              return {
                id: '',
                tierId: tier.id,
                position: index,
                movieId: movie.id,
                movie: movie,
                rating: '',
                review: null,
              }
            })
        : tier.tierMovies
            .filter((movie) =>
              selectedDate
                ? movie.movie.watchDate?.split('-')[0] === selectedDate
                : true,
            )
            .map((movie) => movie)
    })
    setContainerState(movieMatrix)
  }, [tierlistData, selectedDate])

  const handleDateChange = (date: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (date === '') {
      params.delete('date')
    } else {
      params.set('date', date)
    }
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
    setSelectedDate(date)
    const movieMatrix = tierlistData?.tierlistTiers.map((tier) => {
      return tier.value === 0
        ? tier.movies
            .filter((movie) =>
              selectedDate
                ? movie.watchDate?.split('-')[0] === selectedDate
                : true,
            )
            .map((movie, index) => {
              return {
                id: '',
                tierId: tier.id,
                position: index,
                movieId: movie.id,
                movie: movie,
                rating: '',
                review: null,
              }
            })
        : tier.tierMovies
            .filter((movie) =>
              selectedDate
                ? movie.movie.watchDate?.split('-')[0] === selectedDate
                : true,
            )
            .map((movie) => movie)
    })

    setContainerState(movieMatrix)
  }

  function onDragEnd(result: DropResult) {
    if (!authorized || !containerState || !tierlistData) {
      return
    }

    if (selectedDate) {
      toast.error('Reset filters before moving items')
      return
    }

    const { source, destination } = result

    if (!destination) {
      return
    }

    const sInd = +source.droppableId
    const dInd = +destination.droppableId

    const destinationTier = tierlistData.tierlistTiers[dInd]

    if (destinationTier.value === 0) {
      // handle case where no sourceData yet
      toast.error('Cannot unrank or reorder unranked items at this time')
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
        operation: 'reorder',
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

      const sourceTier = tierlistData.tierlistTiers[sInd]
      const destinationTier = tierlistData.tierlistTiers[dInd]

      if (sourceTier.value === 0) {
        // handle case where no sourceData yet
        const sourceData = sourceTier.movies[source.index]

        // construct a tierMovie object
        const newSourceData = {
          id: '',
          tierId: destinationTier.id,
          position: destination.index,
          movieId: sourceData.id,
          rating: '',
          review: null,
        }

        // update the tierlist
        saveMutation.mutate({
          data: {
            sourceData: newSourceData,
            sourceTierId: sourceTier.id,
            destinationTierId: destinationTier.id,
          },
          operation: 'rank',
        })
      } else {
        const sourceData = sourceTier.tierMovies[source.index]

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
          operation: 'move',
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
        sourceData?: TierMovie
        updatedSourceData?: TierMovie
        sourceTierId?: string
        destinationTierId?: string
        destinationData?: TierMovie
        items?: TierMovie[]
      }
      operation: 'reorder' | 'move' | 'rank'
    }) => {
      const res = await fetch(
        `/api/tierlists/${tierlistId}?operation=${operation}`,
        {
          method: 'PUT',
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
      throw new Error('Updating tierlist failed', { cause: body })
    },
    onSuccess: (_data, _variables, _context) => {
      toast.success('Tierlist updated!')
      queryClient.invalidateQueries({
        queryKey: ['tierlists', tierlistId],
      })

      if (_variables.operation === 'rank' && _data.data) {
        setSelectedMovie(_data.data)
      }
    },
    onError: (_error) => {
      toast.error('Updating tierlist failed!')
    },
  })

  return (
    <>
      <div className="flex w-full flex-row items-center justify-center gap-5">
        <TierDateFilter
          values={['2023', '2024', '2025']}
          selectedDate={selectedDate}
          setSelectedDate={handleDateChange}
        />
      </div>
      {tierlistStatus === 'pending' ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="flex flex-col items-start gap-10 md:gap-2 md:overflow-hidden">
          <DragDropContext onDragEnd={onDragEnd}>
            {containerState?.map((tier, tierIndex) => (
              <Tier
                key={tierIndex}
                tierIndex={tierIndex}
                tier={tier}
                label={tiers?.[tierIndex] || ''}
              />
            ))}
          </DragDropContext>
          {tierlistData?.tiers && tierlistData?.tiers?.length <= 4 && (
            <TierCreate tierlistId={tierlistId} />
          )}
        </div>
      )}
      {selectedMovie && (
        <SuccessReview
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  )
}
