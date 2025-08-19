import { getMovieByIdWithReviews } from "@/lib/movies/movies"
import type { MovieWithReviews } from "@/types/movie.type"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> },
): Promise<NextResponse<MovieWithReviews | { ok: false; message: string }>> {
  const params = await props.params
  try {
    const id = params.id
    const movie = await getMovieByIdWithReviews(id)
    
    if (!movie) {
      return NextResponse.json(
        { ok: false, message: "Movie not found" },
        { status: 404 },
      )
    }
    
    return NextResponse.json(movie, { status: 200 })
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 500 },
      )
    }
  }

  return NextResponse.json(
    { ok: false, message: "Something went wrong!" },
    { status: 500 },
  )
}