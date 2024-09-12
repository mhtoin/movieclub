import { sample } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const { userId, movies } = await request.json();

  console.log("received", movies);

  const chosen = sample([...movies], true);

  const chosenIndex = movies.findIndex(
    (movie: Movie) => movie.tmdbId === chosen.tmdbId
  );

  console.log("chosen", chosen, chosenIndex);

  return NextResponse.json({ chosenIndex });
}
