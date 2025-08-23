import type { MovieReview } from "@/types/movie.type"
import { queryOptions } from "@tanstack/react-query"

export const reviewKeys = {
  all: () => ["reviews"] as const,
  byUserAndMovie: (userId: string, movieId: string) =>
    queryOptions({
      queryKey: ["reviews", userId, movieId],
      queryFn: async (): Promise<MovieReview | null> => {
        const res = await fetch(`/api/reviews/${userId}/${movieId}`)
        if (res.status === 404) {
          return null
        }
        if (!res.ok) {
          throw new Error("Failed to fetch review")
        }
        return res.json()
      },
      enabled: !!userId && !!movieId,
    }),
}
