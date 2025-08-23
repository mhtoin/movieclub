import { getWatchHistoryByMonth } from "@/lib/movies/movies"
import type { MovieWithReviews } from "@/types/movie.type"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
): Promise<
  NextResponse<
    | {
        month: string
        movies: MovieWithReviews[]
        nextMonth: string | null
        hasMore: boolean
      }
    | { ok: boolean; message: string }
  >
> {
  try {
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get("month")
    const search = searchParams.get("search") || ""

    const result = await getWatchHistoryByMonth(month, search)

    return NextResponse.json(result, { status: 200 })
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 500 },
      )
    }
    return NextResponse.json(
      { ok: false, message: "An unknown error occurred" },
      { status: 500 },
    )
  }
}
