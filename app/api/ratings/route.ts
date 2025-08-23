import { getCurrentSession } from "@/lib/authentication/session"
import prisma from "@/lib/prisma"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
export async function POST(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const id = params.get("id")
  const movieId = params.get("movieId")

  const { rating } = await request.json()
  const session = await getCurrentSession()

  if (!session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (!movieId) {
    return NextResponse.json(
      { message: "No movieId provided" },
      { status: 400 },
    )
  }

  if (!id) {
    // no review yet, need to create
    const newReview = await prisma?.review.create({
      data: {
        movieId: movieId,
        userId: session.user.id,
        rating: rating,
        content: "",
        timestamp: new Date().toLocaleDateString(),
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json({
      message: "Rating saved",
      review: newReview,
    })
  }

  await prisma?.review.update({
    where: { id },
    data: { rating: rating },
  })

  return NextResponse.json({ message: "Rating updated" })
}
