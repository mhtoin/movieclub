import { getMovie } from "@/lib/movies/movies";
import { sample } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const { userId, movies }: { userId: string; movies: MovieWithUser[] } =
    await request.json();

  const chosen: MovieWithUser = sample([...movies], true);

  const movieObject = await getMovie(chosen.id!);

  const chosenIndex = movies.findIndex(
    (movie: MovieWithUser) => movie.tmdbId === chosen.tmdbId
  );

  console.log("chosenIndex", chosenIndex);
  console.log("chosen", chosen);
  return NextResponse.json({ chosenIndex, movie: movieObject });
}
