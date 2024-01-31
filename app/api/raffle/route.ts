import { NextRequest, NextResponse } from "next/server";
import { chooseMovieOfTheWeek } from "@/lib/movies/movies";
import { isWednesday } from "date-fns";
import Pusher from "pusher";
import { ca } from "date-fns/locale";

export async function POST(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  try {
    const { userId } = await request.json();
    const pusher = new Pusher({
      appId: process.env.app_id!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.secret!,
      cluster: "eu",
      useTLS: true,
    });
    pusher.trigger("movieclub-raffle", "result", {
      message: "request",
      data: {
        userId: userId,
        payload: "request",
      } as PusherPayload,
    });
    // get all shortlists and check that everyone is ready
    const todayIsWednesday =
      process.env.NODE_ENV !== "development" ? isWednesday(new Date()) : true;

    if (todayIsWednesday) {
      try {
        const chosenMovie = await chooseMovieOfTheWeek();
        await pusher
          .trigger("movieclub-raffle", "result", {
            message: "result",
            data: {
              userId: userId,
              payload: chosenMovie,
            } as PusherPayload,
          })
          .catch((err) => {
            //throw new Error(err.message);
            return NextResponse.error();
          });
        return NextResponse.json(
          { ok: true, movie: chosenMovie },
          { status: 200 }
        );
      } catch (e) {
        if (e instanceof Error) {
          pusher.trigger("movieclub-raffle", "result", {
            message: "error",
            data: {
              userId: userId,
              payload: e.message,
            } as PusherPayload,
          });
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
      pusher.trigger("movieclub-raffle", "result", {
        message: "error",
        data: {
          userId: userId,
          payload: "It's not Wednesday!",
        } as PusherPayload,
      });
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
