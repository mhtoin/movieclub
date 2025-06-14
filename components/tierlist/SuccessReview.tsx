'use client'
import { useQuery } from '@tanstack/react-query'
import ReviewEditor from 'components/tierlist/ReviewEditor'
import StarRadio from 'components/tierlist/StarRadio'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'components/ui/Dialog'
import { tierlistKeys } from 'lib/tierlist/tierlistKeys'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { TierMovieWithMovieData } from 'types/tierlist.type'

export default function SuccessReview({
  movie,
  onClose,
}: {
  movie: TierMovieWithMovieData
  onClose: () => void
}) {
  const [open, setOpen] = useState(true)
  const pathname = usePathname()
  const tierlistId = pathname.split('/').pop()

  // Fetch the latest tierlist data
  const { data: tierlistData, isLoading } = useQuery({
    ...tierlistKeys.byId(tierlistId || ''),
    enabled: open,
  })

  // Find the latest movie data from the tierlist
  const latestMovieData =
    open && tierlistData
      ? tierlistData.tierlistTiers
          .flatMap((tier) => tier.tierMovies)
          .find((m) => m.id === movie.id) || movie
      : movie

  const [rating, setRating] = useState(Number.parseFloat(movie.rating))

  // Update the rating state when the dialog opens and movie data is available
  useEffect(() => {
    if (open && latestMovieData) {
      setRating(Number.parseFloat(latestMovieData.rating))
    }
  }, [open, latestMovieData])

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (!open) onClose()
      }}
    >
      <DialogContent
        className="z-9999 h-[90vh] max-h-[90vh] max-w-4xl overflow-hidden p-0"
        variant="noClose"
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="relative h-full w-full">
            {/* Background image with overlay */}
            <div className="absolute inset-0 h-full w-full">
              <Image
                src={`https://image.tmdb.org/t/p/original/${latestMovieData.movie.backdrop_path || latestMovieData.movie.poster_path}`}
                alt={latestMovieData.movie.title}
                fill
                className="object-cover opacity-30 blur-xs"
                priority
              />
              {/* Dark overlay for better readability */}
              <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content container with proper padding and z-index */}
            <div className="relative z-10 grid h-full w-full grid-cols-2 gap-4 p-6">
              <div className="col-span-1 h-full w-full shrink-0 border">
                <Image
                  src={`https://image.tmdb.org/t/p/original/${latestMovieData.movie.poster_path}`}
                  alt={latestMovieData.movie.title}
                  width={500}
                  height={750}
                  className="h-full w-full rounded-md object-cover shadow-lg"
                />
              </div>
              <div>
                <DialogHeader>
                  <DialogTitle className="text-xl text-white">
                    {latestMovieData.movie.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex h-full w-full gap-6 overflow-hidden bg-transparent p-2">
                  <div className="flex h-full w-full flex-col items-start gap-4 text-white">
                    <div className="flex max-w-sm shrink-0 grow-0 flex-col gap-2">
                      <StarRadio
                        value={rating}
                        id={latestMovieData.id}
                        onChange={(newValue) => {
                          setRating(newValue)
                        }}
                      />
                    </div>
                    <div className="flex h-full w-full flex-col gap-2">
                      <h2 className="text-lg font-semibold">Review</h2>
                      <ReviewEditor movieData={latestMovieData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
