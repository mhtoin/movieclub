import { NextRequest, NextResponse } from "next/server";
import { chooseMovieOfTheWeek } from "@/lib/movies";
import { isWednesday } from "date-fns";
import Pusher from "pusher"

export async function POST(request: NextRequest, response: Response) {
  try {
    // get all shortlists and check that everyone is ready
    const todayIsWednesday = isWednesday(new Date());

    if (todayIsWednesday) {
      const chosenMovie = await chooseMovieOfTheWeek();

      // update the chosen movie with the date
      // return the movie
      // trigger a pusher event to notify everyone
      const pusher = new Pusher({
        appId: process.env.app_id!,
        key: process.env.key!,
        secret: process.env.secret!,
        cluster: "eu",
        useTLS: true
      });

      console.log('connected pusher', pusher)
      await pusher.trigger("movieclub-raffle", "result", {
        id: 1,
        message: `Movie for ${chosenMovie.movieOfTheWeek?.toLocaleDateString('fi-FI')}`,
        data: chosenMovie
      })
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
