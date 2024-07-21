import { getEventWriter } from "@/lib/eventWriter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  console.log("ChooseMovie");
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const eventWriter = getEventWriter(writer, encoder);

  const chosenMovieStream = async (notifier: ChosenMovieEvent) => {
    console.log("chosenMovieStream");
    notifier.update({
      data: {
        message: "POST update",
      },
      event: "update",
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    notifier.complete({
      data: {
        message: "The movie has been chosen",
      },
      event: "complete",
    });
  };

  chosenMovieStream(eventWriter);

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

export async function GET(request: NextRequest, response: NextResponse) {
  console.log("ChooseMovie GET");
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const eventWriter = getEventWriter(writer, encoder);

  const chosenMovieStream = async (notifier: ChosenMovieEvent) => {
    console.log("chosenMovieStream");
    notifier.update({
      data: {
        message: "Update begun",
      },
      event: "update",
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    notifier.complete({
      data: {
        message: "The movie has been chosen",
      },
      event: "complete",
    });
  };

  chosenMovieStream(eventWriter);

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
