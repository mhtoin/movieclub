import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAllShortLists } from "@/lib/shortlist";
import { chooseMovieOfTheWeek } from "@/lib/movies";
import { isWednesday } from "date-fns";

export async function POST(request: NextRequest, response: Response) {
  try {
    // get all shortlists and check that everyone is ready
    const todayIsWednesday = isWednesday(new Date());

    if (todayIsWednesday) {
      const chosenMovie = await chooseMovieOfTheWeek();

      // update the chosen movie with the date
      // return the movie

      return NextResponse.json({ ok: true, chosenMovie });
    } else {
      throw new Error("Unauthorized");
    }
  } catch (e) {
    console.error("error", e);
    if (e instanceof Error) {
      return NextResponse.json({ ok: false, message: e.message}, { status: 401 });
    } else {
      console.error('something went wrong', e)
    }
    
  }
}
