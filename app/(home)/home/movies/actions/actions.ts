"use server";

import { validateRequest } from "@/lib/auth";
import { createReview } from "@/lib/movies/movies";

export async function createReviewAction(review: string, movieId: string) {
  const { user, session } = await validateRequest();

  const createdReview = await createReview(review, user?.id ?? "", movieId);
}
