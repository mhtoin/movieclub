"use client"
import { MovieWithReviews } from "@/types/movie.type"
import { useQuery } from "@tanstack/react-query"
import { reviewKeys } from "@/lib/reviews/reviewKeys"
import { useCreateOrUpdateReviewMutation } from "@/lib/reviews/mutations"
import ReviewEditor from "components/tierlist/ReviewEditor"
import StarRadio from "components/tierlist/StarRadio"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/Dialog"
import Image from "next/image"
import { useState, useRef, useCallback, useEffect } from "react"
import type { Editor } from "@tiptap/react"
import { Button } from "../ui/Button"
import { Star } from "lucide-react"

export default function ReviewDialog({
  movie,
  userId,
}: {
  movie: MovieWithReviews
  userId: string | undefined
}) {
  const [open, setOpen] = useState(false)
  const editorRef = useRef<Editor | null>(null)
  const initialContentRef = useRef<string | null>(null)

  const userReview = movie.reviews.find((r) => r.user.id === userId)
  const reviewMutation = useCreateOrUpdateReviewMutation(userId || "", movie.id)

  const { data: reviewData } = useQuery({
    ...reviewKeys.byUserAndMovie(userId || "", movie.id),
    initialData: userReview || null,
    enabled: !!userId && open,
  })

  useEffect(() => {
    if (open && reviewData) {
      initialContentRef.current = JSON.stringify(
        JSON.parse(reviewData.content || "{}"),
      )
    } else if (open && !reviewData) {
      initialContentRef.current = JSON.stringify({})
    }
  }, [open, reviewData])

  const handleSave = useCallback(() => {
    if (editorRef.current && userId) {
      const content = editorRef.current.getJSON()
      const currentContentString = JSON.stringify(content)

      if (currentContentString !== initialContentRef.current) {
        if (content && Object.keys(content).length > 0) {
          reviewMutation.mutate({
            content,
            reviewId: reviewData?.id,
          })
        }
      }
    }
  }, [reviewMutation, reviewData?.id, userId])

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen && open) {
        // Dialog is closing, save the content
        handleSave()
      }
      setOpen(newOpen)
    },
    [open, handleSave],
  )

  if (!userId) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center justify-center">
          <Star className="mr-2 h-4 w-4" />
          <span>Add a Review</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="z-9999 h-[90vh] max-h-[90vh] max-w-4xl overflow-hidden p-0"
        variant="noClose"
      >
        <div className="relative h-full w-full">
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={`https://image.tmdb.org/t/p/original/${movie?.images?.backdrops[0]?.file_path || movie?.images?.posters[0]?.file_path}`}
              alt={movie.title}
              fill
              className="object-cover opacity-30 blur-xs"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 grid h-full w-full grid-cols-2 gap-4 p-6">
            <div className="col-span-1 h-full w-full shrink-0 border">
              <Image
                src={`https://image.tmdb.org/t/p/original/${movie?.images?.posters[0]?.file_path}`}
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
                      value={reviewData?.rating || 0}
                      reviewId={reviewData?.id}
                      movieId={movie.id}
                      userId={userId}
                    />
                  </div>
                  <div className="flex h-full w-full flex-col gap-2">
                    <h2 className="text-lg font-semibold">Review</h2>
                    <ReviewEditor
                      reviewData={reviewData}
                      movieId={movie.id}
                      userId={userId}
                      editorRef={editorRef}
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
