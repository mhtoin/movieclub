"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
//import { getServerSession } from "@/lib/deprecated_getServerSession"
import { createReview } from "@/lib/movies"
import { getServerSession } from "next-auth"

export async function createReviewAction(review: string, movieId: string) {
    const session = await getServerSession(authOptions)

    const createdReview =  await createReview(review, session?.user.userId, movieId)

   
}