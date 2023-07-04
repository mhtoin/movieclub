"use server"

import { getServerSession } from "@/lib/getServerSession"
import { createReview } from "@/lib/movies"

export async function createReviewAction(review: string, movieId: string) {
    const session = await getServerSession()

    const createdReview =  await createReview(review, session?.user.userId, movieId)

   
}