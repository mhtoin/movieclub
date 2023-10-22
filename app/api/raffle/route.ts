import { NextRequest, NextResponse } from "next/server";
import { chooseMovieOfTheWeek } from "@/lib/movies";
import { isWednesday } from "date-fns";
import Pusher from "pusher";
import { ca } from "date-fns/locale";

export async function POST(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  try {
    const { userId } = await request.json();
    console.log(userId, 'sent raffle request')
    const pusher = new Pusher({
      appId: process.env.app_id!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.secret!,
      cluster: "eu",
      useTLS: true,
    });
    pusher.trigger("movieclub-raffle", "result", {
      message: "request",
      data: userId
    })
    // get all shortlists and check that everyone is ready
    const todayIsWednesday =
      process.env.NODE_ENV !== "development" ? isWednesday(new Date()) : true;

    if (todayIsWednesday) {
      try {
        const chosenMovie = await chooseMovieOfTheWeek();
        console.log("chosen movie", chosenMovie)

        await pusher
          .trigger("movieclub-raffle", "result", {
            message: 'result',
            data: chosenMovie,
          })
          .catch((err) => {
            //throw new Error(err.message);
            return NextResponse.error()
          });
        return NextResponse.json(
          { ok: true, movie: chosenMovie },
          { status: 200 }
        );
      } catch (e) {
        if (e instanceof Error) {
          console.log("error when choosing, throwing", e.message);
          return NextResponse.json(
            { ok: false, message: e.message },
            { status: 500 }
          );
          //throw new Error(e.message);
        }
      }

      // update the chosen movie with the date
      // return the movie
      // trigger a pusher event to notify everyone
    } else {
      return NextResponse.json(
        { ok: true, message: "Unauthorized!" },
        { status: 401 }
      );
    }
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message },
        { status: 401 }
      );
    }
  }

  return NextResponse.json(
    { ok: false, message: "Something went wrong!" },
    { status: 500 }
  );
}
