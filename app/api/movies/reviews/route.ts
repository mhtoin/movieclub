import { getCurrentSession } from "@/lib/authentication/session"
import { createReview } from "@/lib/movies/movies"
import prisma from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentSession()
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { content, rating, movieId } = await request.json()

    if (!movieId) {
      return NextResponse.json({ message: "Movie ID is required" }, { status: 400 })
    }

    // Check if user already has a review for this movie
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        movieId: movieId,
      },
    })

    let review
    if (existingReview) {
      // Update existing review
      review = await prisma.review.update({
        where: {
          id: existingReview.id,
        },
        data: {
          content: content,
          rating: rating || 0,
          timestamp: new Date().toISOString(),
        },
      })
    } else {
      // Create new review
      review = await prisma.review.create({
        data: {
          content: content,
          rating: rating || 0,
          userId: user.id,
          movieId: movieId,
          timestamp: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json({ message: "Review saved", review })
  } catch (error) {
    console.error("Error saving review:", error)
    return NextResponse.json(
      { message: "Failed to save review" },
      { status: 500 }
    )
  }
}