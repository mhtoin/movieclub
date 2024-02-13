import { getAllMoviesOfTheWeek, getMoviesOfTheWeek } from "@/lib/movies/movies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const movies = await getMoviesOfTheWeek();
    return NextResponse.json(movies, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 401 }
      );
    }
  }
}
