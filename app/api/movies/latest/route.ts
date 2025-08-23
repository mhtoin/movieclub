import { NextResponse } from "next/server"
import { getMostRecentMovieOfTheWeek } from "@/lib/movies/movies"

export async function GET() {
  try {
    const latestMovie = await getMostRecentMovieOfTheWeek()

    return NextResponse.json(latestMovie, { status: 200 })
  } catch (error) {
    console.error("Error fetching latest movies:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch latest movies",
        status: "error",
      },
      { status: 500 },
    )
  }
}
