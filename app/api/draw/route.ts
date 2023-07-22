import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAllShortLists } from "@/lib/shortlist";
import { chooseMovieOfTheWeek, simulateRaffle } from "@/lib/movies";
import { isWednesday } from "date-fns";
import Pusher from "pusher"

/**
 * Function to perform a raffle on the shortlist data x number of times
 * @param request 
 * @param response 
 * @returns 
 */
export async function POST(request: NextRequest, response: Response) {
  try {
    // get all shortlists and check that everyone is ready
    const body = await request.json()
    const repetitions = body.repetitions ? body.repetitions : 1
    const movies = await simulateRaffle(repetitions)

    //console.log('movies', movies)
    return NextResponse.json(movies)
    
    
  } catch (e) {
    console.error("error", e);
    if (e instanceof Error) {
      return NextResponse.json({ ok: false, message: e.message}, { status: 401 });
    } else {
      console.error('something went wrong', e)
    }
    
  }
}
