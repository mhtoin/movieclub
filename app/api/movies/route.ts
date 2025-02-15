import {
  getMoviesOfTheWeek,
  getMoviesOfTheWeekByMonth,
} from "@/lib/movies/movies";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  if (month) {
    const movies = await getMoviesOfTheWeekByMonth(month);
    return NextResponse.json(movies, { status: 200 });
  }
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
