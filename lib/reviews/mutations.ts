import type { MovieReview } from "@/types/movie.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { reviewKeys } from "./reviewKeys"

export function useCreateOrUpdateReviewMutation(
  userId: string,
  movieId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      rating,
      content,
      reviewId,
    }: {
      rating?: number
      content?: unknown
      reviewId?: string
    }): Promise<MovieReview> => {
      if (reviewId) {
        // Update existing review
        const res = await fetch(`/api/reviews?id=${reviewId}`, {
          method: "POST",
          body: JSON.stringify({ rating, content }),
        })
        if (!res.ok) {
          throw new Error("Failed to update review")
        }
        const data = await res.json()
        return data.review
      } else {
        // Create new review
        const res = await fetch(`/api/reviews?movieId=${movieId}`, {
          method: "POST",
          body: JSON.stringify({
            rating: rating ?? 0,
            content: content ?? "",
          }),
        })
        if (!res.ok) {
          throw new Error("Failed to create review")
        }
        const data = await res.json()
        return data.review
      }
    },
    onSuccess: (data) => {
      // Update the query data directly
      queryClient.setQueryData(
        reviewKeys.byUserAndMovie(userId, movieId).queryKey,
        data,
      )

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["movies", "mostRecent", movieId],
      })

      toast.success("Review saved")
    },
    onError: (error) => {
      console.error("Failed to save review:", error)
      toast.error("Failed to save review", {
        description: error.message,
      })
    },
  })
}
