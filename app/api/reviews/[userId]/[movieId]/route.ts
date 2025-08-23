import { getCurrentSession } from "@/lib/authentication/session"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string; movieId: string }> },
) {
  const { userId, movieId } = await params
  const session = await getCurrentSession()

  if (!session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // Users can only fetch their own reviews
  if (session.user.id !== userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const review = await prisma.review.findFirst({
    where: {
      userId,
      movieId,
    },
    include: {
      user: true,
    },
  })

  if (!review) {
    return NextResponse.json({ message: "Review not found" }, { status: 404 })
  }

  return NextResponse.json(review)
}
