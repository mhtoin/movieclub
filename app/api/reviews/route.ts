import { getCurrentSession } from "@/lib/authentication/session"
import prisma from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const id = params.get("id")
  const movieId = params.get("movieId")
  const { content, rating } = await request.json()
  const session = await getCurrentSession()

  if (!session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (!id && !movieId) {
    return NextResponse.json(
      { message: "No id or movieId provided" },
      { status: 400 },
    )
  }

  if (!id && movieId) {
    // Create new review
    const newReview = await prisma?.review.create({
      data: {
        movieId: movieId,
        userId: session.user.id,
        rating: rating ?? 0,
        content: content ? (typeof content === 'string' ? content : JSON.stringify(content)) : "",
        timestamp: new Date().toLocaleDateString(),
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json({
      message: "Review created",
      review: newReview,
    })
  }

  // Update existing review
  if (id) {
    const updateData: { content?: string; rating?: number } = {}
    if (content !== undefined) {
      // Serialize JSON content to string
      updateData.content = typeof content === 'string' ? content : JSON.stringify(content)
    }
    if (rating !== undefined) updateData.rating = rating

    const updatedReview = await prisma?.review.update({
      where: {
        id: id,
      },
      data: updateData,
      include: {
        user: true,
      },
    })

    return NextResponse.json({
      message: "Review updated",
      review: updatedReview,
    })
  }

  return NextResponse.json({ message: "Invalid request" }, { status: 400 })
}
