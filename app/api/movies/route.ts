import {
  getMoviesOfTheWeek,
  getMoviesOfTheWeekByMonth,
} from "@/lib/movies/movies"
import type { MovieWithReviews } from "@/types/movie.type"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
): Promise<
  NextResponse<
    | { month: string; movies: MovieWithReviews[]; lastMonth: string | null }
    | MovieWithReviews[]
    | { ok: boolean; message: string }
  >
> {
  const month = request.nextUrl.searchParams.get("month")
  if (month) {
    const moviesResponse = await getMoviesOfTheWeekByMonth(month)

    if (
      moviesResponse.month &&
      moviesResponse.movies &&
      moviesResponse.movies.length > 0
    ) {
      return NextResponse.json(moviesResponse, { status: 200 })
    }
  }
  try {
    const movies = await getMoviesOfTheWeek()
    return NextResponse.json(movies, { status: 200 })
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 401 },
      )
    }
    return NextResponse.json(
      { ok: false, message: "An unknown error occurred" },
      { status: 500 },
    )
  }
}
