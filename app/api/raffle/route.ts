import { NextRequest, NextResponse } from "next/server";
import { chooseMovieOfTheWeek } from "@/lib/movies";
import { isWednesday } from "date-fns";
import Pusher from "pusher"

export async function POST(request: NextRequest, response: NextResponse): Promise<NextResponse> {
  try {
    // get all shortlists and check that everyone is ready
    const todayIsWednesday = process.env.NODE_ENV !== 'development' ? isWednesday(new Date()) : true;

    if (todayIsWednesday) {
      const chosenMovie = await chooseMovieOfTheWeek();
      // update the chosen movie with the date
      // return the movie
      // trigger a pusher event to notify everyone
      const pusher = new Pusher({
        appId: process.env.app_id!,
        key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
        secret: process.env.secret!,
        cluster: "eu",
        useTLS: true
      });

      await pusher.trigger("movieclub-raffle", "result", {
        message: `Movie for ${chosenMovie.movieOfTheWeek?.toLocaleDateString('fi-FI')}`,
        data: chosenMovie
      }).catch((err) => {
        throw new Error(err.message)
      });
      return NextResponse.json({ ok: true, movie: chosenMovie }, { status: 200 });
    } else {
      return NextResponse.json({ ok: true, message: 'Unauthorized!' }, { status: 401 });
    }
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ ok: false, message: e.message}, { status: 401 });
    }
  }

  return NextResponse.json({ ok: false, message: 'Something went wrong!' }, { status: 500 });
}
