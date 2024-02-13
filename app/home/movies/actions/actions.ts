"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
//import { getServerSession } from "@/lib/deprecated_getServerSession"
import { createReview } from "@/lib/movies/movies";
import { getServerSession } from "next-auth";

export async function createReviewAction(review: string, movieId: string) {
  const session = await getServerSession(authOptions);

  const createdReview = await createReview(
    review,
    session?.user.userId,
    movieId
  );
}
