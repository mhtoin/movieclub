import { getMovie, postRaffleWork } from "@/lib/movies/movies";
import { sample } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { getAllShortLists } from "@/lib/shortlist";

export async function POST(request: NextRequest, response: NextResponse) {
  const {
    movies,
    startingUserId,
  }: { movies: MovieWithUser[]; startingUserId: string } = await request.json();

  /*
  const dbShortlists = await getAllShortLists();

  const allReady = dbShortlists
    .filter((shortlist) => shortlist.participating)
    .every((shortlist) => shortlist.isReady);
  */
  const chosen: MovieWithUser = sample([...movies], true);

  const chosenIndex = movies.findIndex(
    (movie: MovieWithUser) => movie.tmdbId === chosen.tmdbId
  );

  console.log("chosenIndex", chosenIndex);
  console.log("chosen", chosen);
  waitUntil(postRaffleWork({ movies, winner: chosen, startingUserId }));
  return NextResponse.json({ chosenIndex, movie: chosen });
}
