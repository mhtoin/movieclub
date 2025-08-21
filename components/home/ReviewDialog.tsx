'use client'
import { useMutation } from '@tanstack/react-query'
import ReviewEditor from '@/components/home/ReviewEditor'
import StarRadio from 'components/tierlist/StarRadio'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/Dialog'
import { Button } from 'components/ui/Button'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { MovieWithReviews } from '@/types/movie.type'
import type { JSONContent } from '@tiptap/react'
import { toast } from 'sonner'

export default function ReviewDialog({
  movie,
}: {
  movie: MovieWithReviews
}) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)

  // For now, assume no existing review since we can't access user client-side
  // TODO: Add user context or fetch current user's review
  const existingReview = null

  // Set initial rating from existing review
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating)
    }
  }, [existingReview])

  // Mutation for creating/updating reviews
  const reviewMutation = useMutation({
    mutationFn: async ({ content, rating: newRating }: { content: JSONContent, rating: number }) => {
      const reviewData = {
        content,
        rating: newRating,
        movieId: movie.id,
      }

      const res = await fetch('/api/movies/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      if (!res.ok) {
        throw new Error('Failed to save review')
      }

      return res.json()
    },
    onSuccess: () => {
      toast.success('Review saved successfully!')
      setOpen(false)
      // TODO: Refetch movie data to show updated reviews
    },
    onError: () => {
      toast.error('Failed to save review')
    },
  })

  const handleSaveReview = (content: JSONContent) => {
    reviewMutation.mutate({ content, rating })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/30"
        >
          <Plus className="h-4 w-4" />
          <span>{existingReview ? 'Edit Review' : 'Add Review'}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="z-9999 h-[90vh] max-h-[90vh] max-w-4xl overflow-hidden p-0"
        variant="noClose"
      >
        <div className="relative h-full w-full">
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover opacity-30 blur-xs"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 grid h-full w-full grid-cols-2 gap-4 p-6">
            <div className="col-span-1 h-full w-full shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
                className="h-full w-full rounded-md object-cover shadow-lg"
              />
            </div>
            <div>
              <DialogHeader>
                <DialogTitle className="text-xl text-white">
                  {movie.title}
                </DialogTitle>
              </DialogHeader>
              <div className="flex h-full w-full gap-6 overflow-hidden bg-transparent p-2">
                <div className="flex h-full w-full flex-col items-start gap-4 text-white">
                  <div className="flex max-w-sm shrink-0 grow-0 flex-col gap-2">
                    <StarRadio
                      value={rating}
                      id={`review-${movie.id}`}
                      onChange={(newValue) => {
                        setRating(newValue)
                      }}
                    />
                  </div>
                  <div className="flex h-full w-full flex-col gap-2">
                    <h2 className="text-lg font-semibold">Review</h2>
                    <ReviewEditor 
                      movie={movie} 
                      existingContent={existingReview?.content}
                      onSave={handleSaveReview}
                      isLoading={reviewMutation.isPending}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
