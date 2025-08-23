"use client"
import { MovieWithReviews } from "@/types/movie.type"
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
import { useState } from "react"
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
  const userReview = movie.reviews.find((r) => r.user.id === userId)
  const [rating, setRating] = useState(userReview ? userReview.rating : 0)
  const [reviewData, setReviewData] = useState(
    userReview ? userReview : undefined,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                      value={rating}
                      id={reviewData?.id}
                      movieId={movie.id}
                      onChange={(newValue) => {
                        setRating(newValue)
                      }}
                      onSave={setReviewData}
                    />
                  </div>
                  <div className="flex h-full w-full flex-col gap-2">
                    <h2 className="text-lg font-semibold">Review</h2>
                    <ReviewEditor reviewData={userReview} movieId={movie.id} />
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
